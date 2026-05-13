/** Manuscript-backed figures only — audit against thesis. */

export const POSE_CNN_ACCURACY = 85.4
export const POSE_CNN_MAP50 = 87.8
export const CNN_LSTM_HYBRID_ACCURACY = 69.5
export const PAIN_CNN_WEIGHTED_ACCURACY = 99.46
export const PAIN_CNN_F1 = 99.48
export const PAIN_SEVERE_RECALL = 100
export const LSTM_ANGLE_ERROR_REDUCTION = 69
export const LSTM_TEMPORAL_CONSISTENCY = 88.7
export const LSTM_FRAME_WINDOW = 16

export const PHILIPPINE_PTS = 6000
export const PHILIPPINE_POPULATION_M = 110
export const THERAPIST_PATIENT_RATIO = 18000
export const SPORTS_INJURIES_US_2022_M = 3.2

export const DATASET_LOW_PAIN = 46000
export const DATASET_MOD_PAIN = 1400
export const DATASET_SEV_PAIN = 330

export const RESNET18_PARAMS_M = 26.4

export const ISO_OVERALL_MEAN = 4.54
export const ISO_FUNCTIONAL = 4.64
export const ISO_SECURITY = 4.63
export const ISO_RELIABILITY = 4.53
export const ISO_PERFORMANCE = 4.51
export const ISO_USABILITY = 4.49
export const ISO_PORTABILITY = 4.46

export const RESPONDENTS_TOTAL = 57
export const RESPONDENTS_PT = 15

export const JOINT_SHOULDER_PCT = 79.3
export const JOINT_HIP_PCT = 77.5
export const JOINT_WRIST_PCT = 55.8
export const JOINT_ANKLE_PCT = 52.2

export const CONFUSION_MATRIX = [
  [6973, 27, 6],
  [6, 199, 0],
  [0, 0, 49],
] as const

export const THESIS_URL =
  'https://drive.google.com/file/d/1zu0mauIhF20DGk9l5Sy_JmzMRqaljqnU/view?usp=sharing'

export const POSE_CONFIDENCE_THRESHOLD = 0.5

export const CNN_LSTM_IMPROVEMENT_PCT = POSE_CNN_ACCURACY - CNN_LSTM_HYBRID_ACCURACY
