import random
import uuid
from datetime import datetime, timedelta
from app.database import get_collection
from app.auth import hash_password
import logging

logger = logging.getLogger("bloodbridge.seed")

CITIES = [
    {"name": "Bangalore (Central)", "lat": 12.9716, "lng": 77.5946},
    {"name": "Bangalore (Koramangala)", "lat": 12.9352, "lng": 77.6245},
    {"name": "Bangalore (Indiranagar)", "lat": 12.9784, "lng": 77.6408},
    {"name": "Bangalore (HSR Layout)", "lat": 12.9121, "lng": 77.6445},
    {"name": "Bangalore (Whitefield)", "lat": 12.9698, "lng": 77.7500},
    {"name": "Bangalore (Jayanagar)", "lat": 12.9250, "lng": 77.5938},
    {"name": "Bangalore (Electronic City)", "lat": 12.8452, "lng": 77.6602},
    {"name": "Bangalore (Malleshwaram)", "lat": 13.0031, "lng": 77.5643},
    {"name": "Bangalore (Hebbal)", "lat": 13.0358, "lng": 77.5970},
    {"name": "Bangalore (Yelahanka)", "lat": 13.1007, "lng": 77.5963}
]

BLOOD_GROUPS = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"]
BLOOD_WEIGHTS = [0.37, 0.33, 0.11, 0.04, 0.07, 0.06, 0.015, 0.005] # Realistic blood distribution

FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Dakota",
               "Avery", "Peyton", "Quinn", "Skyler", "Reese", "Rowan", "Hayden", "Logan", "Parker", "Emerson"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
              "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

HOSPITAL_PREFIXES = ["St. Mary", "Metro General", "City Heart", "St. Jude", "University Medical Center",
                     "Presbyterian", "Memorial Health", "Valley General", "Trinity Hospital", "Mercy Health Care"]

def generate_seed_data(num_donors=5000, num_hospitals=55, num_requests=1050):
    logger.info("Starting synthetic demo dataset generation...")

    users_col = get_collection("users")
    donors_col = get_collection("donors")
    hospitals_col = get_collection("hospitals")
    requests_col = get_collection("blood_requests")
    demand_col = get_collection("demand_history")
    notifications_col = get_collection("notifications")
    blood_banks_col = get_collection("blood_banks")

    # Clear existing data if re-seeding
    users_col.delete_many({})
    donors_col.delete_many({})
    hospitals_col.delete_many({})
    requests_col.delete_many({})
    demand_col.delete_many({})
    notifications_col.delete_many({})
    blood_banks_col.delete_many({})

    # Seed Connected Bangalore Blood Banks & Inventories
    sample_blood_banks = [
        {
            "_id": "BB-BLR-001",
            "name": "Red Cross Central Blood Bank",
            "city": "Bangalore",
            "locality": "MG Road",
            "address": "26 MG Road, Central Bangalore",
            "phone": "+91 80 2226 8435",
            "lat": 12.9750,
            "lng": 77.6010,
            "inventory": {"O+": 14, "A+": 10, "B+": 12, "AB+": 6, "O-": 3, "A-": 2, "B-": 1, "AB-": 1},
            "status": "ACTIVE",
            "is_demo": True
        },
        {
            "_id": "BB-BLR-002",
            "name": "Rotary TTK Blood Bank & Component Center",
            "city": "Bangalore",
            "locality": "Koramangala",
            "address": "8th Block Koramangala, Bangalore",
            "phone": "+91 80 2553 1452",
            "lat": 12.9360,
            "lng": 77.6210,
            "inventory": {"O+": 18, "A+": 12, "B+": 15, "AB+": 8, "O-": 4, "A-": 3, "B-": 2, "AB-": 1},
            "status": "ACTIVE",
            "is_demo": True
        },
        {
            "_id": "BB-BLR-003",
            "name": "Bowring Hospital Regional Blood Bank",
            "city": "Bangalore",
            "locality": "Shivajinagar",
            "address": "Lady Curzon Road, Shivajinagar, Bangalore",
            "phone": "+91 80 2559 1325",
            "lat": 12.9830,
            "lng": 77.6030,
            "inventory": {"O+": 8, "A+": 6, "B+": 9, "AB+": 4, "O-": 1, "A-": 1, "B-": 0, "AB-": 0},
            "status": "ACTIVE",
            "is_demo": True
        },
        {
            "_id": "BB-BLR-004",
            "name": "Narayana Hrudayalaya Blood Center",
            "city": "Bangalore",
            "locality": "Electronic City",
            "address": "Hosur Road, Electronic City, Bangalore",
            "phone": "+91 80 7122 2222",
            "lat": 12.8460,
            "lng": 77.6620,
            "inventory": {"O+": 22, "A+": 16, "B+": 20, "AB+": 10, "O-": 5, "A-": 4, "B-": 2, "AB-": 2},
            "status": "ACTIVE",
            "is_demo": True
        },
        {
            "_id": "BB-BLR-005",
            "name": "Manipal Hospital Central Blood Bank",
            "city": "Bangalore",
            "locality": "HAL Airport Road",
            "address": "98 HAL Airport Road, Bangalore",
            "phone": "+91 80 2502 4444",
            "lat": 12.9580,
            "lng": 77.6490,
            "inventory": {"O+": 16, "A+": 14, "B+": 11, "AB+": 7, "O-": 2, "A-": 2, "B-": 1, "AB-": 1},
            "status": "ACTIVE",
            "is_demo": True
        },
        {
            "_id": "BB-BLR-006",
            "name": "KC General Hospital Regional Blood Center",
            "city": "Bangalore",
            "locality": "Malleshwaram",
            "address": "5th Cross Malleshwaram, Bangalore",
            "phone": "+91 80 2334 1756",
            "lat": 13.0040,
            "lng": 77.5670,
            "inventory": {"O+": 10, "A+": 8, "B+": 7, "AB+": 3, "O-": 2, "A-": 1, "B-": 1, "AB-": 0},
            "status": "ACTIVE",
            "is_demo": True
        }
    ]
    blood_banks_col.insert_many(sample_blood_banks)

    # 1. Create Default Core Admin User
    admin_id = str(uuid.uuid4())
    admin_doc = {
        "_id": admin_id,
        "email": "admin@bloodbridge.ai",
        "password_hash": hash_password("Admin@123"),
        "role": "ADMIN",
        "name": "BloodBridge AI Chief Admin",
        "is_demo": True,
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(admin_doc)

    # 1b. Create Primary Demo Blood Bank User
    bb_user_id = "bb-user-001"
    bb_user = {
        "_id": bb_user_id,
        "email": "bloodbank@redcross.org",
        "password_hash": hash_password("Bank@123"),
        "role": "BLOOD_BANK",
        "name": "Red Cross Central Blood Bank",
        "is_demo": True,
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(bb_user)
    if sample_blood_banks:
        sample_blood_banks[0]["user_id"] = bb_user_id

    # 2. Create Default Primary Demo Donor
    primary_donor_id = str(uuid.uuid4())
    primary_donor_user = {
        "_id": primary_donor_id,
        "email": "donor@example.com",
        "password_hash": hash_password("Donor@123"),
        "role": "DONOR",
        "name": "Alex Taylor (Demo Donor D001)",
        "is_demo": True,
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(primary_donor_user)

    primary_donor_profile = {
        "_id": primary_donor_id,
        "user_id": primary_donor_id,
        "donor_code": "D001",
        "name": "Alex Taylor",
        "email": "donor@example.com",
        "phone": "+91 98765 43210",
        "age": 29,
        "blood_group": "O+",
        "city": "Bangalore",
        "lat": 12.9716,
        "lng": 77.5946,
        "is_available": True,
        "last_donation_date": (datetime.utcnow() - timedelta(days=90)).strftime("%Y-%m-%d"),
        "response_rate": 95.0,
        "total_donations": 6,
        "is_demo": True
    }
    donors_col.insert_one(primary_donor_profile)

    # 3. Create Default Verified Hospital
    verified_hosp_id = str(uuid.uuid4())
    verified_hosp_user = {
        "_id": verified_hosp_id,
        "email": "hospital@metro.org",
        "password_hash": hash_password("Hospital@123"),
        "role": "HOSPITAL",
        "name": "Metro General Hospital",
        "is_demo": True,
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(verified_hosp_user)

    verified_hosp_profile = {
        "_id": verified_hosp_id,
        "user_id": verified_hosp_id,
        "hospital_name": "Metro General Emergency Hospital",
        "registration_id": "HOSP-BLR-99201",
        "license_no": "LIC-2026-8812",
        "address": "MG Road, Bangalore, Karnataka 560001",
        "city": "Bangalore",
        "lat": 12.9716,
        "lng": 77.5946,
        "phone": "+91 80 2555 0100",
        "status": "VERIFIED",
        "verified_by": "ADMIN",
        "verified_at": datetime.utcnow().isoformat(),
        "is_demo": True
    }
    hospitals_col.insert_one(verified_hosp_profile)

    # 4. Create Default Pending Hospital
    pending_hosp_id = str(uuid.uuid4())
    pending_hosp_user = {
        "_id": pending_hosp_id,
        "email": "hospital@cityheart.org",
        "password_hash": hash_password("Hospital@123"),
        "role": "HOSPITAL",
        "name": "City Heart Medical Institute",
        "is_demo": True,
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(pending_hosp_user)

    pending_hosp_profile = {
        "_id": pending_hosp_id,
        "user_id": pending_hosp_id,
        "hospital_name": "City Heart Medical Institute",
        "registration_id": "HOSP-BLR-44120",
        "license_no": "LIC-2026-3391",
        "address": "100 Feet Rd, Indiranagar, Bangalore, Karnataka 560038",
        "city": "Bangalore",
        "lat": 12.9784,
        "lng": 77.6408,
        "phone": "+91 80 2555 0144",
        "status": "PENDING",
        "is_demo": True
    }
    hospitals_col.insert_one(pending_hosp_profile)

    # 5. Seed 50+ Synthetic Hospitals
    hospitals_list = [verified_hosp_profile, pending_hosp_profile]
    hosp_docs = []
    
    for i in range(3, num_hospitals + 1):
        h_id = str(uuid.uuid4())
        city_info = random.choice(CITIES)
        prefix = random.choice(HOSPITAL_PREFIXES)
        h_name = f"{prefix} {city_info['name']} Center"
        # Small lat/lng offset
        h_lat = city_info['lat'] + round(random.uniform(-0.08, 0.08), 4)
        h_lng = city_info['lng'] + round(random.uniform(-0.08, 0.08), 4)
        
        # 85% verified, 15% pending
        status = "VERIFIED" if random.random() < 0.85 else "PENDING"
        
        h_doc = {
            "_id": h_id,
            "user_id": h_id,
            "hospital_name": h_name,
            "registration_id": f"HOSP-BLR-{random.randint(10000, 99999)}",
            "license_no": f"LIC-2026-{random.randint(1000, 9999)}",
            "address": f"{random.randint(100, 999)} Health Ave, {city_info['name']}",
            "city": "Bangalore",
            "lat": h_lat,
            "lng": h_lng,
            "phone": f"+91 80 {random.randint(2000, 9999)}-{random.randint(1000, 9999)}",
            "status": status,
            "is_demo": True
        }
        hosp_docs.append(h_doc)
        hospitals_list.append(h_doc)
        
    if hosp_docs:
        hospitals_col.insert_many(hosp_docs)

    # 6. Seed 5,000 Synthetic Donors
    donor_docs = []
    for i in range(2, num_donors + 1):
        d_id = str(uuid.uuid4())
        city_info = random.choice(CITIES)
        fn = random.choice(FIRST_NAMES)
        ln = random.choice(LAST_NAMES)
        blood_group = random.choices(BLOOD_GROUPS, weights=BLOOD_WEIGHTS)[0]
        
        # Geolocation around city center (+/- ~15km radius)
        lat = city_info['lat'] + round(random.uniform(-0.12, 0.12), 4)
        lng = city_info['lng'] + round(random.uniform(-0.12, 0.12), 4)
        
        # Last donation date
        days_ago = random.randint(10, 365)
        last_donation_date = (datetime.utcnow() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        
        is_available = random.random() > 0.18 # 82% available
        response_rate = round(random.uniform(70.0, 99.0), 1)
        
        d_doc = {
            "_id": d_id,
            "user_id": d_id,
            "donor_code": f"D{i:04d}",
            "name": f"{fn} {ln}",
            "email": f"donor{i}@bloodbridge-demo.org",
            "phone": f"+91 9{random.randint(100000000, 999999999)}",
            "age": random.randint(18, 62),
            "blood_group": blood_group,
            "city": "Bangalore",
            "lat": lat,
            "lng": lng,
            "is_available": is_available,
            "last_donation_date": last_donation_date,
            "response_rate": response_rate,
            "total_donations": random.randint(1, 15),
            "is_demo": True
        }
        donor_docs.append(d_doc)
        
    # Bulk insert in batches of 1000 for performance
    batch_size = 1000
    for b in range(0, len(donor_docs), batch_size):
        donors_col.insert_many(donor_docs[b:b+batch_size])

    # 7. Seed Sample Emergency Request for Primary Demo Donor Workflow
    sample_req_id = "REQ-DEMO-2026-CRITICAL"
    sample_request = {
        "_id": sample_req_id,
        "hospital_id": verified_hosp_id,
        "hospital_name": "Metro General Emergency Hospital",
        "city": "Bangalore",
        "lat": 12.9716,
        "lng": 77.5946,
        "blood_group": "O+",
        "units_required": 4,
        "priority": "CRITICAL",
        "contact_phone": "+91 80 2555 0100",
        "notes": "Urgent trauma surgery request. Compatible O+ or O- donors required immediately in Bangalore.",
        "status": "OPEN",
        "created_at": datetime.utcnow().isoformat(),
        "is_demo": True
    }
    requests_col.insert_one(sample_request)

    # Initial notification for primary donor D001
    notifications_col.insert_one({
        "_id": str(uuid.uuid4()),
        "donor_id": primary_donor_id,
        "request_id": sample_req_id,
        "hospital_name": "Metro General Emergency Hospital",
        "blood_group": "O+",
        "priority": "CRITICAL",
        "message": "EMERGENCY: Metro General Emergency Hospital requested 4 units of O+ blood near your location in Bangalore.",
        "status": "PENDING",
        "created_at": datetime.utcnow().isoformat(),
        "is_demo": True
    })

    # 8. Seed 1,000+ Historical Blood Requests & Demand Records
    req_docs = []
    demand_docs = []
    priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    p_weights = [0.15, 0.45, 0.25, 0.15]
    statuses = ["FULFILLED", "FULFILLED", "FULFILLED", "DONOR_ACCEPTED", "OPEN"]

    for k in range(1, num_requests + 1):
        hosp = random.choice(hospitals_list)
        bg = random.choices(BLOOD_GROUPS, weights=BLOOD_WEIGHTS)[0]
        prio = random.choices(priorities, weights=p_weights)[0]
        units = random.randint(1, 6)
        days_back = random.randint(1, 180)
        req_date = datetime.utcnow() - timedelta(days=days_back)
        
        req_id = f"REQ-HIST-{k:04d}"
        status = random.choice(statuses)
        
        r_doc = {
            "_id": req_id,
            "hospital_id": hosp["_id"],
            "hospital_name": hosp["hospital_name"],
            "city": hosp["city"],
            "lat": hosp["lat"],
            "lng": hosp["lng"],
            "blood_group": bg,
            "units_required": units,
            "priority": prio,
            "contact_phone": hosp["phone"],
            "notes": f"Historical emergency request for {bg} blood.",
            "status": status,
            "created_at": req_date.isoformat(),
            "is_demo": True
        }
        req_docs.append(r_doc)
        
        demand_docs.append({
            "_id": str(uuid.uuid4()),
            "blood_group": bg,
            "city": hosp["city"],
            "units": units,
            "priority": prio,
            "date": req_date.strftime("%Y-%m-%d"),
            "timestamp": req_date.isoformat(),
            "is_demo": True
        })

    for b in range(0, len(req_docs), batch_size):
        requests_col.insert_many(req_docs[b:b+batch_size])
        demand_col.insert_many(demand_docs[b:b+batch_size])

    logger.info(f"Successfully generated demo data: {num_donors} donors, {len(hospitals_list)} hospitals, {len(req_docs)} requests.")
    return {
        "status": "success",
        "donors": num_donors + 1,
        "hospitals": len(hospitals_list),
        "blood_requests": len(req_docs) + 1,
        "message": "Demo data populated cleanly."
    }

if __name__ == "__main__":
    generate_seed_data()
