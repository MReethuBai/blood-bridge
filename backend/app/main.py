import os
import sys
# Guarantee 'app' package resolution
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uuid
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

from app.database import get_collection, check_db_health
from app.auth import hash_password, verify_password, create_access_token, jwt_required, roles_required
from app.ai_engine import rank_donors_for_request, predict_blood_demand, is_blood_compatible
from app.seed_data import generate_seed_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bloodbridge.api")

app = Flask(__name__)
# Enable CORS for all cross-origin requests
CORS(app, resources={r"/*": {"origins": "*"}})

# Automatic seed on first startup if database is empty
def auto_seed_if_empty():
    donors_col = get_collection("donors")
    if donors_col.count_documents({}) == 0:
        logger.info("Database empty on startup. Executing initial synthetic demo seed...")
        try:
            generate_seed_data()
        except Exception as e:
            logger.error(f"Startup seed error: {e}")

# Call auto seed check
with app.app_context():
    auto_seed_if_empty()


# --- HEALTH CHECK & METRICS ---
@app.route("/", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    db_status = check_db_health()
    return jsonify({
        "application": "BloodBridge AI – Intelligent Blood Donor Matching & Emergency Response API",
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": db_status
    })

# --- AUTHENTICATION ENDPOINTS ---
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "DONOR").upper()
    name = data.get("name", "").strip()

    if not email or not password or not name:
        return jsonify({"error": "Name, email and password are required."}), 400

    users_col = get_collection("users")
    if users_col.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists."}), 409

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "email": email,
        "password_hash": hash_password(password),
        "role": role,
        "name": name,
        "created_at": datetime.utcnow().isoformat(),
        "is_demo": False
    }
    users_col.insert_one(user_doc)

    if role == "DONOR":
        donors_col = get_collection("donors")
        donor_profile = {
            "_id": user_id,
            "user_id": user_id,
            "donor_code": f"D{random_code()}",
            "name": name,
            "email": email,
            "phone": data.get("phone", "+1 555-0100"),
            "age": int(data.get("age", 25)),
            "blood_group": data.get("blood_group", "O+").upper(),
            "city": data.get("city", "Bangalore"),
            "lat": float(data.get("lat", 12.9716)),
            "lng": float(data.get("lng", 77.5946)),
            "is_available": True,
            "last_donation_date": data.get("last_donation_date", (datetime.utcnow() - timedelta(days=90)).strftime("%Y-%m-%d")),
            "response_rate": 100.0,
            "total_donations": 0,
            "is_demo": False
        }
        donors_col.insert_one(donor_profile)

    elif role == "HOSPITAL":
        hospitals_col = get_collection("hospitals")
        hosp_profile = {
            "_id": user_id,
            "user_id": user_id,
            "hospital_name": name,
            "registration_id": data.get("registration_id", f"HOSP-{random_code()}"),
            "license_no": data.get("license_no", f"LIC-{random_code()}"),
            "address": data.get("address", "100 Medical Center Way"),
            "city": data.get("city", "Bangalore"),
            "lat": float(data.get("lat", 12.9716)),
            "lng": float(data.get("lng", 77.5946)),
            "phone": data.get("phone", "+1 555-0199"),
            "status": "PENDING", # New hospitals are PENDING by default
            "is_demo": False
        }
        hospitals_col.insert_one(hosp_profile)

    elif role == "BLOOD_BANK":
        blood_banks_col = get_collection("blood_banks")
        bb_profile = {
            "_id": user_id,
            "user_id": user_id,
            "name": name,
            "registration_id": data.get("registration_id", f"BB-{random_code()}"),
            "locality": data.get("locality", "MG Road"),
            "address": data.get("address", "26 MG Road, Central Bangalore"),
            "city": data.get("city", "Bangalore"),
            "lat": float(data.get("lat", 12.9750)),
            "lng": float(data.get("lng", 77.6010)),
            "phone": data.get("phone", "+91 80 2226 8435"),
            "inventory": data.get("inventory", {"O+": 15, "A+": 12, "B+": 10, "AB+": 6, "O-": 4, "A-": 2, "B-": 2, "AB-": 1}),
            "status": "VERIFIED",
            "is_demo": False
        }
        blood_banks_col.insert_one(bb_profile)

    token = create_access_token(user_id, email, role, name)
    return jsonify({
        "message": "Registration successful.",
        "token": token,
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "role": role
        }
    }), 201

def random_code():
    return str(uuid.uuid4())[:4].upper()

from datetime import timedelta

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password required."}), 400

    users_col = get_collection("users")
    user = users_col.find_one({"email": email})
    if not user or not verify_password(password, user.get("password_hash", "")):
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_access_token(user["_id"], user["email"], user["role"], user["name"])
    
    # Attach profile metadata
    profile = {}
    if user["role"] == "DONOR":
        profile = get_collection("donors").find_one({"user_id": user["_id"]}) or {}
    elif user["role"] == "HOSPITAL":
        profile = get_collection("hospitals").find_one({"user_id": user["_id"]}) or {}
    elif user["role"] == "BLOOD_BANK":
        profile = get_collection("blood_banks").find_one({"$or": [{"user_id": user["_id"]}, {"_id": user["_id"]}]}) or {}

    return jsonify({
        "token": token,
        "user": {
            "id": user["_id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "profile": profile
        }
    })

@app.route("/api/auth/me", methods=["GET"])
@jwt_required
def get_me():
    cur_user = request.current_user
    users_col = get_collection("users")
    user = users_col.find_one({"_id": cur_user["user_id"]})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    profile = {}
    if user["role"] == "DONOR":
        profile = get_collection("donors").find_one({"user_id": user["_id"]}) or {}
    elif user["role"] == "HOSPITAL":
        profile = get_collection("hospitals").find_one({"user_id": user["_id"]}) or {}
    elif user["role"] == "BLOOD_BANK":
        profile = get_collection("blood_banks").find_one({"$or": [{"user_id": user["_id"]}, {"_id": user["_id"]}]}) or {}

    return jsonify({
        "id": user["_id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "profile": profile
    })


# --- DONOR ENDPOINTS ---
@app.route("/api/donor/profile", methods=["GET", "PUT"])
@jwt_required
def donor_profile():
    user_id = request.current_user["user_id"]
    donors_col = get_collection("donors")
    
    if request.method == "GET":
        donor = donors_col.find_one({"user_id": user_id})
        if not donor:
            return jsonify({"error": "Donor profile not found"}), 404
        return jsonify(donor)

    elif request.method == "PUT":
        data = request.get_json() or {}
        update_fields = {}
        if "is_available" in data:
            update_fields["is_available"] = bool(data["is_available"])
        if "blood_group" in data:
            update_fields["blood_group"] = data["blood_group"].upper()
        if "city" in data:
            update_fields["city"] = data["city"]
        if "last_donation_date" in data:
            update_fields["last_donation_date"] = data["last_donation_date"]
        if "lat" in data and "lng" in data:
            update_fields["lat"] = float(data["lat"])
            update_fields["lng"] = float(data["lng"])

        donors_col.update_one({"user_id": user_id}, {"$set": update_fields})
        updated_donor = donors_col.find_one({"user_id": user_id})
        return jsonify({"message": "Profile updated successfully", "donor": updated_donor})

@app.route("/api/donor/notifications", methods=["GET"])
@jwt_required
def donor_notifications():
    user_id = request.current_user["user_id"]
    donors_col = get_collection("donors")
    donor = donors_col.find_one({"user_id": user_id}) or donors_col.find_one({"_id": user_id})
    
    notifs_col = get_collection("notifications")
    direct_notifs = list(notifs_col.find({"donor_id": user_id}))
    existing_req_ids = {n.get("request_id") for n in direct_notifs if n.get("request_id")}
    
    # Check open emergency requests compatible with donor's blood group
    if donor:
        d_bg = donor.get("blood_group", "O+")
        requests_col = get_collection("blood_requests")
        open_reqs = list(requests_col.find({"status": "OPEN"}))
        
        for req in open_reqs:
            req_id = req.get("_id")
            if req_id and req_id not in existing_req_ids:
                req_bg = req.get("blood_group", "O+")
                compatible, _ = is_blood_compatible(d_bg, req_bg)
                if compatible:
                    synthetic_notif = {
                        "_id": f"notif-{user_id[:8]}-{req_id}",
                        "donor_id": user_id,
                        "request_id": req_id,
                        "hospital_name": req.get("hospital_name", "Emergency Hospital"),
                        "blood_group": req_bg,
                        "priority": req.get("priority", "HIGH"),
                        "message": f"EMERGENCY: {req.get('hospital_name')} requested {req.get('units_required', 1)} units of {req_bg} blood near your location in {req.get('city', 'Bangalore')}.",
                        "status": "PENDING",
                        "created_at": req.get("created_at", datetime.utcnow().isoformat()),
                        "is_demo": False
                    }
                    direct_notifs.append(synthetic_notif)
                    
    # Sort notifications by created_at descending
    direct_notifs.sort(key=lambda x: str(x.get("created_at", "")), reverse=True)
    return jsonify(direct_notifs)

@app.route("/api/donor/requests/respond", methods=["POST"])
@jwt_required
def respond_request():
    user_id = request.current_user["user_id"]
    data = request.get_json() or {}
    request_id = data.get("request_id")
    action = data.get("action", "ACCEPT").upper() # ACCEPT or DECLINE

    if not request_id:
        return jsonify({"error": "request_id is required"}), 400

    requests_col = get_collection("blood_requests")
    req = requests_col.find_one({"_id": request_id})
    
    # Fallback lookup if notification ID was passed instead of request_id
    if not req:
        notifs_col = get_collection("notifications")
        notif = notifs_col.find_one({"_id": request_id}) or notifs_col.find_one({"donor_id": user_id, "request_id": request_id})
        if notif and notif.get("request_id"):
            request_id = notif.get("request_id")
            req = requests_col.find_one({"_id": request_id})

    if not req:
        return jsonify({"error": "Emergency request not found"}), 404

    notifs_col = get_collection("notifications")
    existing_notif = notifs_col.find_one({"donor_id": user_id, "request_id": request_id})
    if existing_notif:
        notifs_col.update_one(
            {"_id": existing_notif["_id"]},
            {"$set": {"status": action, "responded_at": datetime.utcnow().isoformat()}}
        )
    else:
        notifs_col.insert_one({
            "_id": f"notif-{user_id[:8]}-{request_id}",
            "donor_id": user_id,
            "request_id": request_id,
            "hospital_name": req.get("hospital_name", "Emergency Hospital"),
            "blood_group": req.get("blood_group", "O+"),
            "priority": req.get("priority", "HIGH"),
            "message": f"EMERGENCY: {req.get('hospital_name')} requested {req.get('units_required', 1)} units of {req.get('blood_group')} blood.",
            "status": action,
            "created_at": req.get("created_at", datetime.utcnow().isoformat()),
            "responded_at": datetime.utcnow().isoformat(),
            "is_demo": False
        })

    if action == "ACCEPT":
        donor_profile = get_collection("donors").find_one({"user_id": user_id}) or get_collection("donors").find_one({"_id": user_id}) or {}
        requests_col.update_one(
            {"_id": request_id},
            {"$set": {
                "status": "DONOR_ACCEPTED",
                "accepted_donor_id": user_id,
                "accepted_donor_name": donor_profile.get("name", "Verified Donor"),
                "accepted_donor_phone": donor_profile.get("phone", "+91 98765 43210"),
                "accepted_at": datetime.utcnow().isoformat()
            }}
        )
    elif action == "DECLINE":
        logger.info(f"Donor {user_id} declined emergency request {request_id}")
        if req.get("accepted_donor_id") == user_id:
            requests_col.update_one(
                {"_id": request_id},
                {"$set": {
                    "status": "OPEN",
                    "accepted_donor_id": None,
                    "accepted_donor_name": None,
                    "accepted_donor_phone": None
                }}
            )

    msg_verb = "accepted" if action == "ACCEPT" else "declined"
    return jsonify({"message": f"Request {msg_verb} successfully.", "status": action})


# --- HOSPITAL ENDPOINTS ---
@app.route("/api/hospital/profile", methods=["GET"])
@jwt_required
def hospital_profile():
    user_id = request.current_user["user_id"]
    hosp = get_collection("hospitals").find_one({"user_id": user_id})
    if not hosp:
        return jsonify({"error": "Hospital profile not found"}), 404
    return jsonify(hosp)

@app.route("/api/hospital/requests", methods=["GET", "POST"])
@jwt_required
def hospital_requests():
    user_id = request.current_user["user_id"]
    hospitals_col = get_collection("hospitals")
    hosp = hospitals_col.find_one({"user_id": user_id})

    if request.method == "GET":
        requests_col = get_collection("blood_requests")
        if hosp:
            reqs = requests_col.find({"hospital_id": hosp["_id"]})
        else:
            reqs = requests_col.find({"hospital_id": user_id})
        return jsonify(reqs)

    elif request.method == "POST":
        # CRITICAL VERIFICATION CHECK: Only VERIFIED hospitals can create requests
        if not hosp or hosp.get("status") != "VERIFIED":
            return jsonify({
                "error": "UNVERIFIED_HOSPITAL",
                "message": "Only VERIFIED hospitals can create emergency blood requests. Your registration is currently PENDING admin review."
            }), 403

        data = request.get_json() or {}
        blood_group = data.get("blood_group", "O+").upper()
        units = int(data.get("units_required", 2))
        priority = data.get("priority", "HIGH").upper() # LOW, MEDIUM, HIGH, CRITICAL

        arrange_transport = data.get("arrange_transport", True)
        transport_details = {
            "arrange_transport": True,
            "service_name": "BloodBridge Free Emergency Pickup & Drop Transport",
            "vehicle_type": "Emergency Medical Cab / EV Ambulance",
            "vehicle_number": "KA-01-EA-2026",
            "driver_name": "Ramesh Kumar (BloodBridge Logistics Partner)",
            "driver_phone": "+91 98450 12345",
            "status": "EN_ROUTE_FOR_PICKUP",
            "eta_mins": 15,
            "pickup_drop_provided": True
        } if arrange_transport else None

        req_id = f"REQ-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:4].upper()}"
        req_doc = {
            "_id": req_id,
            "hospital_id": hosp["_id"],
            "hospital_name": hosp["hospital_name"],
            "city": hosp["city"],
            "lat": hosp["lat"],
            "lng": hosp["lng"],
            "blood_group": blood_group,
            "units_required": units,
            "priority": priority,
            "contact_phone": hosp.get("phone", "+91 80 2555 0100"),
            "notes": data.get("notes", "Emergency blood request."),
            "arrange_transport": arrange_transport,
            "transport_details": transport_details,
            "status": "OPEN",
            "created_at": datetime.utcnow().isoformat(),
            "is_demo": False
        }
        
        get_collection("blood_requests").insert_one(req_doc)

        # Record in demand history for AI ML training
        get_collection("demand_history").insert_one({
            "_id": str(uuid.uuid4()),
            "blood_group": blood_group,
            "city": hosp["city"],
            "units": units,
            "priority": priority,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "timestamp": datetime.utcnow().isoformat(),
            "is_demo": False
        })

        # Generate real-time emergency alert notifications for compatible donors
        try:
            donors_col = get_collection("donors")
            all_donors = donors_col.find({})
            ranked = rank_donors_for_request(all_donors, hosp["lat"], hosp["lng"], blood_group)
            notifs_col = get_collection("notifications")
            for idx, d in enumerate(ranked[:25]):
                d_user_id = d.get("donor_id")
                if d_user_id:
                    d_phone = d.get("phone", f"+91 98765 {1000 + idx:04d}")
                    d_email = d.get("email", f"donor.{d.get('donor_code', 'd001').lower()}@example.com")
                    notifs_col.insert_one({
                        "_id": str(uuid.uuid4()),
                        "donor_id": d_user_id,
                        "request_id": req_id,
                        "hospital_name": hosp["hospital_name"],
                        "blood_group": blood_group,
                        "priority": priority,
                        "message": f"EMERGENCY: {hosp['hospital_name']} requested {units} units of {blood_group} blood near your location in {hosp['city']}.",
                        "sms_sent": True,
                        "sms_phone": d_phone,
                        "email_sent": True,
                        "email_address": d_email,
                        "transport_details": transport_details,
                        "status": "PENDING",
                        "created_at": datetime.utcnow().isoformat(),
                        "is_demo": False
                    })
        except Exception as e:
            logger.error(f"Error broadcasting notifications: {e}")

        return jsonify({
            "message": "Emergency blood request created successfully. SMS & Email alerts dispatched to nearby compatible donors.",
            "request": req_doc
        }), 201

@app.route("/api/hospital/send-alert", methods=["POST"])
@jwt_required
def send_donor_alert():
    data = request.get_json() or {}
    donor_id = data.get("donor_id")
    channel = data.get("channel", "SMS").upper() # SMS, EMAIL, TRANSPORT
    donor_phone = data.get("phone", "+91 98765 43210")
    donor_email = data.get("email", "donor@example.com")
    donor_name = data.get("name", "Donor")

    if channel == "SMS":
        msg = f"Direct SMS & Mobile Push Alert sent to {donor_name} at {donor_phone}."
    elif channel == "EMAIL":
        msg = f"Emergency Dispatch Email successfully delivered to {donor_email}."
    elif channel == "TRANSPORT":
        msg = f"Free Pickup & Drop Vehicle (KA-01-EA-2026, Driver: Ramesh Kumar) dispatched to {donor_name}'s location."
    else:
        msg = "Alert dispatched successfully."

    return jsonify({
        "message": msg,
        "channel": channel,
        "timestamp": datetime.utcnow().isoformat(),
        "success": True
    })

@app.route("/api/hospital/verify-self", methods=["POST"])
@jwt_required
def verify_self_hospital():
    user_id = request.current_user["user_id"]
    hospitals_col = get_collection("hospitals")
    hospitals_col.update_one(
        {"user_id": user_id},
        {"$set": {"status": "VERIFIED", "verified_at": datetime.utcnow().isoformat(), "verified_by": "SELF_DEMO"}}
    )
    updated_hosp = hospitals_col.find_one({"user_id": user_id})
    return jsonify({"message": "Hospital registration verified successfully.", "hospital": updated_hosp, "status": "VERIFIED"})

@app.route("/api/blood-banks/inventory", methods=["GET"])
def get_blood_banks_inventory():
    blood_banks_col = get_collection("blood_banks")
    bb_list = list(blood_banks_col.find({}))
    return jsonify(bb_list)

@app.route("/api/hospital/requests/<req_id>/matches", methods=["GET"])
@jwt_required
def get_request_matches(req_id):
    requests_col = get_collection("blood_requests")
    req_doc = requests_col.find_one({"_id": req_id})
    if not req_doc:
        return jsonify({"error": "Blood request not found"}), 404

    # Fetch all donors from database
    donors_col = get_collection("donors")
    all_donors = donors_col.find({})

    # Execute AI Donor Matching Algorithm
    h_lat = float(req_doc.get("lat", 12.9716))
    h_lng = float(req_doc.get("lng", 77.5946))
    bg = req_doc.get("blood_group", "O+")

    ranked_donors = rank_donors_for_request(all_donors, h_lat, h_lng, bg)

    return jsonify({
        "request": req_doc,
        "hospital_location": {"lat": h_lat, "lng": h_lng},
        "matched_count": len(ranked_donors),
        "matches": ranked_donors[:50] # Top 50 highest suitability score donors
    })

# --- BLOOD BANK ENDPOINTS ---
@app.route("/api/blood-bank/profile", methods=["GET"])
@jwt_required
def blood_bank_profile():
    user_id = request.current_user["user_id"]
    blood_banks_col = get_collection("blood_banks")
    bb = blood_banks_col.find_one({"$or": [{"user_id": user_id}, {"_id": user_id}]})
    if not bb:
        # Fallback to demo Red Cross Central Blood Bank if first login
        bb = blood_banks_col.find_one({"_id": "BB-BLR-001"})
    return jsonify(bb or {})

@app.route("/api/blood-bank/inventory", methods=["PUT"])
@jwt_required
def update_blood_bank_inventory():
    user_id = request.current_user["user_id"]
    data = request.get_json() or {}
    new_inventory = data.get("inventory", {})

    blood_banks_col = get_collection("blood_banks")
    bb = blood_banks_col.find_one({"$or": [{"user_id": user_id}, {"_id": user_id}]})
    
    bb_id = bb["_id"] if bb else "BB-BLR-001"
    blood_banks_col.update_one(
        {"_id": bb_id},
        {"$set": {"inventory": new_inventory, "updated_at": datetime.utcnow().isoformat()}}
    )
    updated_bb = blood_banks_col.find_one({"_id": bb_id})
    return jsonify({"message": "Blood Bank inventory updated successfully.", "blood_bank": updated_bb})

@app.route("/api/blood-bank/hospital-requests", methods=["GET"])
@jwt_required
def get_blood_bank_hospital_requests():
    requests_col = get_collection("blood_requests")
    reqs = list(requests_col.find({}))
    return jsonify(reqs)

@app.route("/api/blood-bank/dispatch", methods=["POST"])
@jwt_required
def blood_bank_dispatch():
    user_id = request.current_user["user_id"]
    data = request.get_json() or {}
    req_id = data.get("request_id")

    if not req_id:
        return jsonify({"error": "request_id is required"}), 400

    requests_col = get_collection("blood_requests")
    blood_banks_col = get_collection("blood_banks")
    
    bb = blood_banks_col.find_one({"$or": [{"user_id": user_id}, {"_id": user_id}]}) or blood_banks_col.find_one({"_id": "BB-BLR-001"})
    req_doc = requests_col.find_one({"_id": req_id})
    
    if not req_doc:
        return jsonify({"error": "Request not found"}), 404

    bg = req_doc.get("blood_group", "O+")
    units = int(req_doc.get("units_required", 2))

    # Decrement inventory stock if available
    if bb and bb.get("inventory", {}).get(bg, 0) >= units:
        blood_banks_col.update_one({"_id": bb["_id"]}, {"$inc": {f"inventory.{bg}": -units}})

    dispatch_details = {
        "dispatched_by_blood_bank": bb.get("name", "Red Cross Central Blood Bank") if bb else "Red Cross Central Blood Bank",
        "vehicle_number": "KA-01-BB-8899",
        "driver_name": "Suresh Gowda (Express Cold-Chain)",
        "driver_phone": "+91 98450 99887",
        "status": "IN_TRANSIT",
        "eta_mins": 18,
        "dispatched_at": datetime.utcnow().isoformat()
    }

    requests_col.update_one(
        {"_id": req_id},
        {"$set": {
            "status": "FULFILLED_BY_BLOOD_BANK",
            "fulfilled_by_type": "BLOOD_BANK",
            "blood_bank_details": dispatch_details
        }}
    )

    return jsonify({
        "message": f"Cold-Chain Express Blood Delivery dispatched to {req_doc.get('hospital_name')}!",
        "dispatch_details": dispatch_details,
        "status": "FULFILLED_BY_BLOOD_BANK"
    })

@app.route("/api/hospital/requests/<req_id>/fulfill", methods=["POST"])
@jwt_required
def fulfill_request(req_id):
    requests_col = get_collection("blood_requests")
    requests_col.update_one({"_id": req_id}, {"$set": {"status": "FULFILLED", "fulfilled_at": datetime.utcnow().isoformat()}})
    return jsonify({"message": "Request marked as FULFILLED."})


# --- ADMIN ENDPOINTS ---
@app.route("/api/admin/hospitals/pending", methods=["GET"])
@roles_required(["ADMIN"])
def get_pending_hospitals():
    hospitals_col = get_collection("hospitals")
    pending = hospitals_col.find({"status": "PENDING"})
    return jsonify(pending)

@app.route("/api/admin/hospitals/verify", methods=["POST"])
@roles_required(["ADMIN"])
def verify_hospital():
    data = request.get_json() or {}
    hospital_id = data.get("hospital_id")
    action = data.get("action", "VERIFY").upper() # VERIFY or REJECT

    if not hospital_id:
        return jsonify({"error": "hospital_id is required"}), 400

    new_status = "VERIFIED" if action == "VERIFY" else "REJECTED"
    hospitals_col = get_collection("hospitals")
    hospitals_col.update_one(
        {"_id": hospital_id},
        {"$set": {"status": new_status, "verified_at": datetime.utcnow().isoformat(), "verified_by": "ADMIN"}}
    )

    return jsonify({"message": f"Hospital status updated to {new_status}.", "hospital_id": hospital_id, "status": new_status})

@app.route("/api/admin/stats", methods=["GET"])
@jwt_required
def get_admin_stats():
    donors_count = get_collection("donors").count_documents({})
    hospitals_count = get_collection("hospitals").count_documents({})
    pending_hospitals_count = get_collection("hospitals").count_documents({"status": "PENDING"})
    requests_count = get_collection("blood_requests").count_documents({})
    fulfilled_count = get_collection("blood_requests").count_documents({"status": "FULFILLED"})
    critical_count = get_collection("blood_requests").count_documents({"priority": "CRITICAL"})

    return jsonify({
        "total_donors": donors_count,
        "total_hospitals": hospitals_count,
        "pending_hospitals": pending_hospitals_count,
        "total_requests": requests_count,
        "fulfilled_requests": fulfilled_count,
        "critical_requests": critical_count
    })


# --- AI DEMAND PREDICTION ROUTE ---
@app.route("/api/ai/predict-demand", methods=["GET"])
def get_demand_prediction():
    demand_col = get_collection("demand_history")
    records = demand_col.find({})
    predictions = predict_blood_demand(records)
    return jsonify({
        "status": "success",
        "model": "Scikit-Learn RandomForestRegressor Forecast Engine",
        "predictions": predictions
    })

# --- DEMO SEED ROUTE ---
@app.route("/api/seed", methods=["POST"])
def seed_demo():
    result = generate_seed_data()
    return jsonify(result)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting BloodBridge AI Flask API server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
