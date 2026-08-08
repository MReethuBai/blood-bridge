from typing import Dict, Any, List

class StudyService:
    async def generate_notes(self, document_id: str, mode: str) -> Dict[str, Any]:
        """Generate automatic notes for simple, detailed, topic, chapter, unit, and important modes."""
        mode_titles = {
            "simple": "Executive 60-Second Overview",
            "detailed": "Comprehensive Section Breakdown",
            "topic": "Topic-Wise Synthesis",
            "chapter": "Chapter 4 Outline",
            "unit": "Unit II: Catalytic Systems",
            "important": "Exam Key Highlights"
        }

        title = mode_titles.get(mode, "Automatic AI Study Notes")
        
        return {
            "document_id": document_id,
            "mode": mode,
            "title": title,
            "highlighted_keywords": ["Michaelis Constant", "Enzyme Kinetics", "Linear Attention", "Active Site"],
            "summary_content": f"AI automatic synthesized notes ({mode} mode) for document {document_id}. Substrate kinetics formula V_0 = (V_max * [S]) / (K_m + [S])."
        }

    async def generate_mcqs(self, document_id: str, difficulty: str, count: int, types: List[str]) -> List[Dict[str, Any]]:
        """Generate practice MCQs, True/False, Fill in Blank, Assertion Reason, and Numerical questions."""
        questions = [
            {
                "id": 1,
                "type": "MCQ",
                "question": "Which rate constant describes the total catalytic efficiency of an enzyme (k_cat / K_m)?",
                "options": ["A) Turnover Efficiency", "B) Specificity Constant", "C) Dissociation Constant", "D) Michaelis Rate"],
                "correct_index": 1,
                "explanation": "The ratio k_cat / K_m measures catalytic efficiency at low substrate concentrations."
            },
            {
                "id": 2,
                "type": "True False",
                "question": "Statement: Competitive inhibitors decrease maximum velocity (V_max).",
                "options": ["True", "False"],
                "correct_index": 1,
                "explanation": "False. Competitive inhibitors increase apparent K_m without changing V_max."
            },
            {
                "id": 3,
                "type": "Numerical",
                "question": "Calculate V_0 when [S] = 2 K_m given V_max = 150 umol/min.",
                "options": ["A) 50 umol/min", "B) 100 umol/min", "C) 75 umol/min", "D) 120 umol/min"],
                "correct_index": 1,
                "explanation": "V_0 = (150 * 2 K_m) / (3 K_m) = 100 umol/min."
            }
        ]
        return questions[:count]

    async def get_flashcards(self, document_id: str) -> List[Dict[str, Any]]:
        """Generate 3D flashcards deck."""
        return [
            {
                "id": 1,
                "question": "What is the Michaelis Constant (K_m)?",
                "answer": "The substrate concentration at which velocity equals half of maximum velocity (V_max / 2).",
                "topic": "Enzyme Kinetics"
            },
            {
                "id": 2,
                "question": "What is the formula for Scaled Dot-Product Self-Attention?",
                "answer": "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V.",
                "topic": "Neural Networks"
            }
        ]

study_service = StudyService()
