window.RESPIRA = {
 "generated_utc": "2026-10-02T12:15:54+00:00",
 "version": "1.1.0",
 "public": false,
 "cohort": {
  "n_subjects": 86,
  "n_with_v2": 76,
  "follow_up_years": {
   "min": 2.94,
   "mean": 3.92,
   "max": 9.57
  },
  "copd_v1": 30,
  "pre_copd": 8,
  "control": 48,
  "rapid_decline": 14,
  "incident_copd": 2,
  "dfev1_ml_per_year": {
   "min": -220.82,
   "median": -4.97,
   "max": 217.65
  },
  "with_ct": {
   "control": 5,
   "COPD": 5,
   "pre-COPD": 4
  }
 },
 "tier_a": {
  "models": [
   {
    "model": "primary",
    "covariates": "age+sex_female+bmi+pack_years+fev1_pp_gli+fev1_fvc_ratio",
    "n": 76,
    "events": 14,
    "auc": 0.568,
    "ci_lo": 0.4219,
    "ci_hi": 0.7188,
    "auprc": 0.234,
    "prevalence": 0.1842,
    "brier": 0.1628
   },
   {
    "model": "sensitivity",
    "covariates": "age+sex_female+bmi+pack_years+fev1_pp_gli+fev1_fvc_ratio+current_smoker+dlco_pp",
    "n": 76,
    "events": 14,
    "auc": 0.5207,
    "ci_lo": 0.3697,
    "ci_hi": 0.6849,
    "auprc": 0.2174,
    "prevalence": 0.1842,
    "brier": 0.1675
   },
   {
    "model": "fev1_only",
    "covariates": "fev1_pp_gli",
    "n": 76,
    "events": 14,
    "auc": 0.553,
    "ci_lo": 0.3803,
    "ci_hi": 0.7166,
    "auprc": 0.2104,
    "prevalence": 0.1842,
    "brier": 0.1535
   }
  ],
  "univariate": [
   {
    "covariate": "age",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "46.00 [43.00, 49.00]",
    "no_event_median_iqr": "44.50 [40.00, 47.00]",
    "cliffs_delta": 0.227,
    "p_exact": 0.1936
   },
   {
    "covariate": "sex_female",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "0.00 [0.00, 0.75]",
    "no_event_median_iqr": "1.00 [0.00, 1.00]",
    "cliffs_delta": -0.2465,
    "p_exact": 0.1551
   },
   {
    "covariate": "bmi",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "26.39 [24.37, 30.32]",
    "no_event_median_iqr": "26.93 [24.03, 30.07]",
    "cliffs_delta": 0.0541,
    "p_exact": 0.7656
   },
   {
    "covariate": "pack_years",
    "n_event": 12,
    "n_no_event": 60,
    "event_median_iqr": "23.57 [20.52, 28.57]",
    "no_event_median_iqr": "22.53 [16.18, 30.63]",
    "cliffs_delta": 0.0778,
    "p_exact": 0.6815
   },
   {
    "covariate": "fev1_pp_gli",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "85.74 [77.71, 90.80]",
    "no_event_median_iqr": "93.27 [79.00, 102.73]",
    "cliffs_delta": -0.2028,
    "p_exact": 0.244
   },
   {
    "covariate": "fev1_fvc_ratio",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "0.65 [0.60, 0.73]",
    "no_event_median_iqr": "0.75 [0.67, 0.79]",
    "cliffs_delta": -0.3018,
    "p_exact": 0.0803
   },
   {
    "covariate": "current_smoker",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "1.00 [0.25, 1.00]",
    "no_event_median_iqr": "1.00 [0.00, 1.00]",
    "cliffs_delta": -0.0115,
    "p_exact": 0.9525
   },
   {
    "covariate": "dlco_pp",
    "n_event": 14,
    "n_no_event": 62,
    "event_median_iqr": "76.50 [65.00, 81.00]",
    "no_event_median_iqr": "73.50 [69.00, 84.50]",
    "cliffs_delta": -0.0933,
    "p_exact": 0.6004
   }
  ],
  "coefficients": {
   "primary": {
    "age": 0.4417,
    "sex_female": -0.5379,
    "bmi": 0.0287,
    "pack_years": -0.2663,
    "fev1_pp_gli": 0.0546,
    "fev1_fvc_ratio": -0.4125
   },
   "sensitivity": {
    "age": 0.4528,
    "sex_female": -0.5525,
    "bmi": 0.0759,
    "pack_years": -0.2529,
    "fev1_pp_gli": 0.0986,
    "fev1_fvc_ratio": -0.3858,
    "current_smoker": 0.1634,
    "dlco_pp": -0.1715
   },
   "fev1_only": {
    "fev1_pp_gli": -0.2814
   }
  },
  "dfev1_hist": {
   "edges": [
    -240,
    -220,
    -200,
    -180,
    -160,
    -140,
    -120,
    -100,
    -80,
    -60,
    -40,
    -20,
    0,
    20,
    40,
    60,
    80,
    100,
    120,
    140,
    160,
    180,
    200,
    220,
    240
   ],
   "counts": [
    1,
    1,
    1,
    0,
    0,
    1,
    2,
    3,
    5,
    6,
    10,
    10,
    11,
    8,
    5,
    7,
    3,
    0,
    1,
    0,
    0,
    0,
    1,
    0
   ],
   "threshold": -60,
   "n": 76
  }
 },
 "bridge": {
  "n_imaged": 14,
  "n_by_group": {
   "control": 5,
   "pre-COPD": 4,
   "COPD": 5
  },
  "scores": [
   "laa950_pct",
   "perc15_hu",
   "laa950_upper_lower_ratio",
   "aw_dysanapsis",
   "aw_pi10_mm"
  ],
  "skipped_scores": [
   "prm_fsad_pct"
  ],
  "primary_score": "laa950_pct",
  "binary_vs_continuous": {
   "score": "laa950_pct",
   "label": "%LAA-950",
   "read_yes_median_iqr": "0.29 [0.23, 1.63]",
   "n_yes": 4,
   "read_no_median_iqr": "0.27 [0.16, 0.50]",
   "n_no": 5,
   "cliffs_delta": 0.0,
   "p_exact": 1.0,
   "overlap": true
  },
  "groups": [
   {
    "score": "laa950_pct",
    "label": "%LAA-950",
    "control_median_iqr": "0.27 [0.16, 0.50]",
    "n_control": 5,
    "precopd_median_iqr": "0.29 [0.23, 1.63]",
    "n_precopd": 4,
    "copd_median_iqr": "0.67 [0.66, 2.19]",
    "n_copd": 5,
    "cliffs_delta_pre_vs_control": 0.0,
    "delta_ci_lo": -0.8,
    "delta_ci_hi": 0.8,
    "p_exact_pre_vs_control": 1.0,
    "cliffs_delta_copd_vs_control": 0.68,
    "p_exact_copd_vs_control": 0.09523809523809523
   },
   {
    "score": "perc15_hu",
    "label": "Perc15 (HU)",
    "control_median_iqr": "-881.52 [-901.18, -861.21]",
    "n_control": 5,
    "precopd_median_iqr": "-884.54 [-895.22, -872.05]",
    "n_precopd": 4,
    "copd_median_iqr": "-901.95 [-926.81, -893.76]",
    "n_copd": 5,
    "cliffs_delta_pre_vs_control": -0.1,
    "delta_ci_lo": -0.8,
    "delta_ci_hi": 0.8,
    "p_exact_pre_vs_control": 0.9047619047619049,
    "cliffs_delta_copd_vs_control": 0.6,
    "p_exact_copd_vs_control": 0.15079365079365079
   },
   {
    "score": "laa950_upper_lower_ratio",
    "label": "Upper/lower LAA ratio",
    "control_median_iqr": "2.11 [0.89, 4.62]",
    "n_control": 5,
    "precopd_median_iqr": "2.10 [0.41, 4.49]",
    "n_precopd": 4,
    "copd_median_iqr": "1.35 [1.31, 5.82]",
    "n_copd": 5,
    "cliffs_delta_pre_vs_control": -0.2,
    "delta_ci_lo": -1.0,
    "delta_ci_hi": 0.8,
    "p_exact_pre_vs_control": 0.7301587301587302,
    "cliffs_delta_copd_vs_control": 0.04,
    "p_exact_copd_vs_control": 1.0
   },
   {
    "score": "aw_dysanapsis",
    "label": "Dysanapsis proxy",
    "control_median_iqr": "0.03 [0.02, 0.03]",
    "n_control": 5,
    "precopd_median_iqr": "0.03 [0.03, 0.03]",
    "n_precopd": 4,
    "copd_median_iqr": "0.02 [0.02, 0.02]",
    "n_copd": 5,
    "cliffs_delta_pre_vs_control": 0.4,
    "delta_ci_lo": -0.6,
    "delta_ci_hi": 1.0,
    "p_exact_pre_vs_control": 0.4126984126984127,
    "cliffs_delta_copd_vs_control": 0.84,
    "p_exact_copd_vs_control": 0.031746031746031744
   },
   {
    "score": "aw_pi10_mm",
    "label": "Pi10 proxy (mm)",
    "control_median_iqr": "8.65 [8.30, 9.64]",
    "n_control": 5,
    "precopd_median_iqr": "8.70 [8.23, 9.41]",
    "n_precopd": 4,
    "copd_median_iqr": "8.81 [8.48, 8.81]",
    "n_copd": 5,
    "cliffs_delta_pre_vs_control": 0.0,
    "delta_ci_lo": -0.8,
    "delta_ci_hi": 0.8,
    "p_exact_pre_vs_control": 1.0,
    "cliffs_delta_copd_vs_control": -0.12,
    "p_exact_copd_vs_control": 0.8412698412698413
   }
  ],
  "within": {
   "laa950_pct": {
    "label": "%LAA-950",
    "direction": "higher = more damage",
    "groups": {
     "control": {
      "n": 5,
      "min": 0.1528454253786798,
      "max": 0.9484025845502052,
      "range": 0.7955571591715254,
      "median": 0.2734869368664663,
      "cv_pct": 81.61573742609782,
      "ranked_subjects": [
       "13",
       "12",
       "19",
       "1",
       "15"
      ]
     },
     "pre-COPD": {
      "n": 4,
      "min": 0.111283527549346,
      "max": 5.533998453458635,
      "range": 5.422714925909289,
      "median": 0.29411060950487616,
      "cv_pct": 170.1719786623109,
      "ranked_subjects": [
       "23",
       "55",
       "51",
       "65"
      ]
     },
     "COPD": {
      "n": 5,
      "min": 0.3004285158225539,
      "max": 6.658131806214144,
      "range": 6.357703290391591,
      "median": 0.6704088989597281,
      "cv_pct": 126.54096128189946,
      "ranked_subjects": [
       "28",
       "2",
       "29",
       "17",
       "11"
      ]
     }
    },
    "spearman_vs_dfev1_all": {
     "rho": -0.30769230769230765,
     "p": 0.309,
     "n": 13
    },
    "spearman_vs_dfev1_non_copd": {
     "rho": -0.28571428571428575,
     "p": 0.4979,
     "n": 8
    },
    "spearman_vs_fev1_fvc_all": {
     "rho": 0.6175824175824175,
     "p": 0.0213,
     "n": 14
    }
   },
   "perc15_hu": {
    "label": "Perc15 (HU)",
    "direction": "lower = more damage",
    "groups": {
     "control": {
      "n": 5,
      "min": -916.1895751953124,
      "max": -859.1676635742188,
      "range": 57.021911621093636,
      "median": -881.5172729492188,
      "cv_pct": 2.813398788254192,
      "ranked_subjects": [
       "13",
       "12",
       "19",
       "1",
       "15"
      ]
     },
     "pre-COPD": {
      "n": 4,
      "min": -914.68896484375,
      "max": -847.1360473632812,
      "range": 67.55291748046875,
      "median": -884.5426025390625,
      "cv_pct": 3.157065148452735,
      "ranked_subjects": [
       "23",
       "55",
       "51",
       "65"
      ]
     },
     "COPD": {
      "n": 5,
      "min": -937.5698852539062,
      "max": -891.1514892578125,
      "range": 46.41839599609375,
      "median": -901.9510498046876,
      "cv_pct": 2.2822477952960667,
      "ranked_subjects": [
       "28",
       "2",
       "11",
       "29",
       "17"
      ]
     }
    },
    "spearman_vs_dfev1_all": {
     "rho": -0.23076923076923078,
     "p": 0.44935,
     "n": 13
    },
    "spearman_vs_dfev1_non_copd": {
     "rho": -0.11904761904761905,
     "p": 0.7853,
     "n": 8
    },
    "spearman_vs_fev1_fvc_all": {
     "rho": 0.5956043956043956,
     "p": 0.02815,
     "n": 14
    }
   },
   "laa950_upper_lower_ratio": {
    "label": "Upper/lower LAA ratio",
    "direction": "higher = more damage",
    "groups": {
     "control": {
      "n": 5,
      "min": 0.8787495471758997,
      "max": 6.182879384799777,
      "range": 5.3041298376238775,
      "median": 2.1098705559234405,
      "cv_pct": 80.7497190482332,
      "ranked_subjects": [
       "19",
       "13",
       "15",
       "12",
       "1"
      ]
     },
     "pre-COPD": {
      "n": 4,
      "min": 0.1593276087789159,
      "max": 6.875498303524076,
      "range": 6.716170694745161,
      "median": 2.095644644943186,
      "cv_pct": 112.16634860751029,
      "ranked_subjects": [
       "51",
       "23",
       "55",
       "65"
      ]
     },
     "COPD": {
      "n": 5,
      "min": 0.1856259556814601,
      "max": 7.481598943498132,
      "range": 7.295972987816672,
      "median": 1.3479206483428037,
      "cv_pct": 99.4370668377909,
      "ranked_subjects": [
       "11",
       "2",
       "28",
       "29",
       "17"
      ]
     }
    },
    "spearman_vs_dfev1_all": {
     "rho": -0.12637362637362637,
     "p": 0.6824,
     "n": 13
    },
    "spearman_vs_dfev1_non_copd": {
     "rho": -0.14285714285714288,
     "p": 0.74575,
     "n": 8
    },
    "spearman_vs_fev1_fvc_all": {
     "rho": 0.23076923076923075,
     "p": 0.42435,
     "n": 14
    }
   },
   "aw_dysanapsis": {
    "label": "Dysanapsis proxy",
    "direction": "lower = more damage",
    "groups": {
     "control": {
      "n": 5,
      "min": 0.0240947505937087,
      "max": 0.0331383255899223,
      "range": 0.009043574996213603,
      "median": 0.0289362348444011,
      "cv_pct": 14.241038668618309,
      "ranked_subjects": [
       "15",
       "19",
       "13",
       "1",
       "12"
      ]
     },
     "pre-COPD": {
      "n": 4,
      "min": 0.0235237354515904,
      "max": 0.0265834535047903,
      "range": 0.003059718053199899,
      "median": 0.02605527360612655,
      "cv_pct": 5.404790308297019,
      "ranked_subjects": [
       "51",
       "55",
       "65",
       "23"
      ]
     },
     "COPD": {
      "n": 5,
      "min": 0.0191804076764724,
      "max": 0.0268405506552809,
      "range": 0.007660142978808501,
      "median": 0.0231449476180866,
      "cv_pct": 12.012451776905808,
      "ranked_subjects": [
       "17",
       "11",
       "29",
       "28",
       "2"
      ]
     }
    },
    "spearman_vs_dfev1_all": {
     "rho": 0.3186813186813187,
     "p": 0.29135,
     "n": 13
    },
    "spearman_vs_dfev1_non_copd": {
     "rho": -0.2142857142857143,
     "p": 0.6218,
     "n": 8
    },
    "spearman_vs_fev1_fvc_all": {
     "rho": 0.6615384615384616,
     "p": 0.0117,
     "n": 14
    }
   },
   "aw_pi10_mm": {
    "label": "Pi10 proxy (mm)",
    "direction": "higher = more damage",
    "groups": {
     "control": {
      "n": 5,
      "min": 7.652492370248754,
      "max": 10.591872924626902,
      "range": 2.9393805543781477,
      "median": 8.646568274393722,
      "cv_pct": 12.921522807463962,
      "ranked_subjects": [
       "1",
       "15",
       "13",
       "19",
       "12"
      ]
     },
     "pre-COPD": {
      "n": 4,
      "min": 7.495742777555648,
      "max": 10.869058113993852,
      "range": 3.3733153364382034,
      "median": 8.698592914728497,
      "cv_pct": 15.845096913446476,
      "ranked_subjects": [
       "65",
       "23",
       "55",
       "51"
      ]
     },
     "COPD": {
      "n": 5,
      "min": 7.29699360861674,
      "max": 9.2819456118736,
      "range": 1.9849520032568595,
      "median": 8.80660277230277,
      "cv_pct": 8.771462949486931,
      "ranked_subjects": [
       "11",
       "17",
       "2",
       "28",
       "29"
      ]
     }
    },
    "spearman_vs_dfev1_all": {
     "rho": 0.23626373626373626,
     "p": 0.43325,
     "n": 13
    },
    "spearman_vs_dfev1_non_copd": {
     "rho": 0.3571428571428572,
     "p": 0.3857,
     "n": 8
    },
    "spearman_vs_fev1_fvc_all": {
     "rho": -0.3450549450549451,
     "p": 0.2236,
     "n": 14
    }
   }
  },
  "longitudinal": {
   "score": "laa950_pct",
   "rows": [
    {
     "subject": "S763d941ade",
     "group": "COPD",
     "n_ct": 6,
     "span_years": 8.24,
     "n_contrast": 2,
     "laa950_pct_first": 0.7989336967805103,
     "laa950_pct_last": 1.7690385875640344,
     "laa950_pct_slope_per_year": 0.13073187154811114,
     "dfev1_ml_per_year": -107.42817098808663,
     "points": [
      [
       0.0,
       0.7989,
       true
      ],
      [
       0.745,
       0.6606,
       false
      ],
      [
       1.747,
       0.7358,
       false
      ],
      [
       3.411,
       0.9597,
       false
      ],
      [
       5.385,
       1.2916,
       false
      ],
      [
       8.244,
       1.769,
       true
      ]
     ]
    },
    {
     "subject": "S408804cb65",
     "group": "pre-COPD",
     "n_ct": 3,
     "span_years": 6.69,
     "n_contrast": 2,
     "laa950_pct_first": 0.9298145445356848,
     "laa950_pct_last": 0.6319825974679212,
     "laa950_pct_slope_per_year": 0.03534234316896793,
     "dfev1_ml_per_year": 94.41797140912124,
     "points": [
      [
       0.0,
       0.9298,
       true
      ],
      [
       3.912,
       5.534,
       false
      ],
      [
       6.691,
       0.632,
       true
      ]
     ]
    },
    {
     "subject": "S71d99defd7",
     "group": "COPD",
     "n_ct": 5,
     "span_years": 8.74,
     "n_contrast": 3,
     "laa950_pct_first": 0.6704088989597281,
     "laa950_pct_last": 0.43718028221888,
     "laa950_pct_slope_per_year": 0.035793786888024696,
     "dfev1_ml_per_year": -40.74127074985702,
     "points": [
      [
       0.0,
       0.6704,
       false
      ],
      [
       4.331,
       0.1865,
       false
      ],
      [
       4.674,
       0.6086,
       true
      ],
      [
       6.746,
       1.8239,
       true
      ],
      [
       8.742,
       0.4372,
       true
      ]
     ]
    },
    {
     "subject": "S07ec2277c2",
     "group": "pre-COPD",
     "n_ct": 2,
     "span_years": 2.88,
     "n_contrast": 1,
     "laa950_pct_first": 0.3435371554260956,
     "laa950_pct_last": 0.3227254994631456,
     "laa950_pct_slope_per_year": -0.00723883685667826,
     "dfev1_ml_per_year": 24.065934065933757,
     "points": [
      [
       0.0,
       0.3435,
       true
      ],
      [
       2.875,
       0.3227,
       false
      ]
     ]
    },
    {
     "subject": "Sf366741a50",
     "group": "pre-COPD",
     "n_ct": 3,
     "span_years": 2.71,
     "n_contrast": 1,
     "laa950_pct_first": 0.111283527549346,
     "laa950_pct_last": 0.7456805740966927,
     "laa950_pct_slope_per_year": 0.26053817443250094,
     "dfev1_ml_per_year": -40.04219409282636,
     "points": [
      [
       0.0,
       0.1113,
       false
      ],
      [
       0.608,
       0.0389,
       true
      ],
      [
       2.71,
       0.7457,
       false
      ]
     ]
    }
   ]
  },
  "prm": {
   "n_subjects": 1,
   "rows": [
    {
     "subject": "S763d941ade",
     "group": "COPD",
     "fsad_pct": 51.51,
     "emph_pct": 0.66,
     "normal_pct": 47.83
    }
   ],
   "note": "PRM needs a registered expiratory scan; it exists for these subjects only"
  },
  "scanner": {
   "kernels": {
    "STANDARD": 14
   },
   "slice_thickness": {
    "1.25": 14
   }
  },
  "caveats": [
   "the pre-COPD label is partly CT-defined; group recovery is not independent validation",
   "n < 30 imaged subjects: effect sizes and exact tests only, no discrimination metrics",
   "dysanapsis and Pi10 are automated proxies, not the atlas-based published definitions",
   "Pi10 at 1 mm isotropic resolution reads roughly twice the literature values (partial volume); within-cohort ordering is meaningful, the absolute number is not"
  ],
  "subjects": [
   {
    "id": "Sbe6ab81b33",
    "group": "COPD",
    "emphysema_read": 0,
    "dfev1": -73.1,
    "rapid_decline": 1,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.3004,
     "perc15_hu": -901.951,
     "laa950_upper_lower_ratio": 7.4816,
     "aw_dysanapsis": 0.0221,
     "aw_pi10_mm": 9.2819
    }
   },
   {
    "id": "S763d941ade",
    "group": "COPD",
    "emphysema_read": 0,
    "dfev1": -107.4,
    "rapid_decline": 1,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.6606,
     "perc15_hu": -891.1515,
     "laa950_upper_lower_ratio": 0.1856,
     "aw_dysanapsis": 0.0192,
     "aw_pi10_mm": 8.8067
    }
   },
   {
    "id": "S71d99defd7",
    "group": "COPD",
    "emphysema_read": 0,
    "dfev1": -40.7,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.6704,
     "perc15_hu": -893.7604,
     "laa950_upper_lower_ratio": 1.3148,
     "aw_dysanapsis": 0.0231,
     "aw_pi10_mm": 7.297
    }
   },
   {
    "id": "S7eb57fe4cb",
    "group": "COPD",
    "emphysema_read": 1,
    "dfev1": 68.0,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 2.1905,
     "perc15_hu": -926.8136,
     "laa950_upper_lower_ratio": 5.8241,
     "aw_dysanapsis": 0.0268,
     "aw_pi10_mm": 8.8066
    }
   },
   {
    "id": "S48da29b7fb",
    "group": "COPD",
    "emphysema_read": 1,
    "dfev1": 97.0,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 6.6581,
     "perc15_hu": -937.5699,
     "laa950_upper_lower_ratio": 1.3479,
     "aw_dysanapsis": 0.0235,
     "aw_pi10_mm": 8.4783
    }
   },
   {
    "id": "Se31feffa69",
    "group": "control",
    "emphysema_read": 0,
    "dfev1": -20.7,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.1528,
     "perc15_hu": -859.1677,
     "laa950_upper_lower_ratio": 2.1099,
     "aw_dysanapsis": 0.0241,
     "aw_pi10_mm": 9.6388
    }
   },
   {
    "id": "S91a68122fe",
    "group": "control",
    "emphysema_read": 0,
    "dfev1": null,
    "rapid_decline": null,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.165,
     "perc15_hu": -861.2097,
     "laa950_upper_lower_ratio": 0.8787,
     "aw_dysanapsis": 0.0317,
     "aw_pi10_mm": 10.5919
    }
   },
   {
    "id": "S7d0651e5c1",
    "group": "control",
    "emphysema_read": 0,
    "dfev1": -25.7,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.2735,
     "perc15_hu": -881.5173,
     "laa950_upper_lower_ratio": 6.1829,
     "aw_dysanapsis": 0.0247,
     "aw_pi10_mm": 8.2988
    }
   },
   {
    "id": "Se462ddcc2e",
    "group": "control",
    "emphysema_read": 0,
    "dfev1": 2.8,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.4974,
     "perc15_hu": -901.1774,
     "laa950_upper_lower_ratio": 0.889,
     "aw_dysanapsis": 0.0331,
     "aw_pi10_mm": 7.6525
    }
   },
   {
    "id": "Sfd1610ea47",
    "group": "control",
    "emphysema_read": 0,
    "dfev1": -62.2,
    "rapid_decline": 1,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.9484,
     "perc15_hu": -916.1896,
     "laa950_upper_lower_ratio": 4.6245,
     "aw_dysanapsis": 0.0289,
     "aw_pi10_mm": 8.6466
    }
   },
   {
    "id": "Sf366741a50",
    "group": "pre-COPD",
    "emphysema_read": 1,
    "dfev1": -40.0,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.1113,
     "perc15_hu": -847.136,
     "laa950_upper_lower_ratio": 0.1593,
     "aw_dysanapsis": 0.0262,
     "aw_pi10_mm": 10.8691
    }
   },
   {
    "id": "S65f2b16659",
    "group": "pre-COPD",
    "emphysema_read": 1,
    "dfev1": 71.6,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.2655,
     "perc15_hu": -880.3564,
     "laa950_upper_lower_ratio": 6.8755,
     "aw_dysanapsis": 0.0235,
     "aw_pi10_mm": 7.4957
    }
   },
   {
    "id": "S07ec2277c2",
    "group": "pre-COPD",
    "emphysema_read": 1,
    "dfev1": 24.1,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 0.3227,
     "perc15_hu": -888.7288,
     "laa950_upper_lower_ratio": 0.4903,
     "aw_dysanapsis": 0.0259,
     "aw_pi10_mm": 8.4786
    }
   },
   {
    "id": "S408804cb65",
    "group": "pre-COPD",
    "emphysema_read": 1,
    "dfev1": 94.4,
    "rapid_decline": 0,
    "kernel": "STANDARD",
    "slice_thickness": 1.25,
    "scores": {
     "laa950_pct": 5.534,
     "perc15_hu": -914.689,
     "laa950_upper_lower_ratio": 3.701,
     "aw_dysanapsis": 0.0266,
     "aw_pi10_mm": 8.9186
    }
   }
  ]
 },
 "molecular": {
  "mode": "SIMULATED",
  "n_subjects": 86,
  "n_cpg": 2000,
  "y_block": [
   "age",
   "sex_female",
   "bmi",
   "pack_years",
   "fev1_pp_gli",
   "fev1_fvc_ratio",
   "laa950_pct",
   "perc15_hu",
   "aw_dysanapsis",
   "aw_pi10_mm"
  ],
  "canonical_correlation": 0.9114637924166719,
  "p_permutation": 0.04590818363273453,
  "null_rho_95": 0.9097136009971964,
  "n_perm": 500,
  "l1_bounds": [
   6.0,
   3.1622776601683795
  ],
  "cv_held_out_rho_by_bound": {
   "1.5": 0.8214245622040182,
   "2.0": 0.8388488387034471,
   "3.0": 0.863227383461517,
   "4.0": 0.8728432048247818,
   "6.0": 0.8774638264914065,
   "8.0": 0.8696921832527421
  },
  "n_cpg_selected": 40,
  "recovery": {
   "n_selected": 40,
   "n_true": 40,
   "true_positives": 40,
   "precision": 1.0,
   "recall": 1.0
  },
  "null_rho": [
   0.5886,
   0.9025,
   0.8803,
   0.8604,
   0.8817,
   0.8976,
   0.8836,
   0.9177,
   0.9009,
   0.8801,
   0.9073,
   0.8515,
   0.8939,
   0.8836,
   0.8869,
   0.52,
   0.8808,
   0.8753,
   0.8956,
   0.8872,
   0.8557,
   0.9076,
   0.8882,
   0.8633,
   0.9052,
   0.897,
   0.8872,
   0.8826,
   0.875,
   0.8801,
   0.869,
   0.8676,
   0.9138,
   0.8753,
   0.902,
   0.8799,
   0.8825,
   0.905,
   0.8836,
   0.8719,
   0.7192,
   0.8816,
   0.4997,
   0.8967,
   0.8992,
   0.8826,
   0.9018,
   0.8786,
   0.8724,
   0.8834,
   0.8977,
   0.9104,
   0.8464,
   0.8969,
   0.9097,
   0.8732,
   0.8859,
   0.9206,
   0.8801,
   0.5048,
   0.8747,
   0.878,
   0.8791,
   0.9005,
   0.8984,
   0.8751,
   0.8911,
   0.8691,
   0.8603,
   0.8816,
   0.8895,
   0.88,
   0.8675,
   0.8599,
   0.8858,
   0.9079,
   0.9061,
   0.8921,
   0.8903,
   0.6049,
   0.8914,
   0.8602,
   0.8869,
   0.8948,
   0.875,
   0.8835,
   0.9083,
   0.8686,
   0.9009,
   0.885,
   0.8823,
   0.916,
   0.8493,
   0.8802,
   0.8765,
   0.8957,
   0.9073,
   0.8748,
   0.8748,
   0.8817,
   0.88,
   0.8856,
   0.8763,
   0.8617,
   0.8684,
   0.8809,
   0.866,
   0.8746,
   0.8874,
   0.7039,
   0.8629,
   0.9148,
   0.8969,
   0.8904,
   0.9146,
   0.8833,
   0.89,
   0.875,
   0.879,
   0.8737,
   0.899,
   0.8997,
   0.8255,
   0.8775,
   0.8851,
   0.8752,
   0.9128,
   0.9059,
   0.9133,
   0.8842,
   0.8929,
   0.8911,
   0.8803,
   0.8954,
   0.9002,
   0.8833,
   0.8857,
   0.913,
   0.8829,
   0.8757,
   0.9024,
   0.8884,
   0.902,
   0.8915,
   0.5517,
   0.8737,
   0.894,
   0.8939,
   0.8908,
   0.8741,
   0.8922,
   0.524,
   0.8792,
   0.9031,
   0.8915,
   0.8809,
   0.8855,
   0.8821,
   0.888,
   0.8717,
   0.8964,
   0.8156,
   0.8814,
   0.8852,
   0.9102,
   0.8667,
   0.8797,
   0.8824,
   0.8662,
   0.9006,
   0.8698,
   0.8975,
   0.9013,
   0.8039,
   0.8727,
   0.894,
   0.9125,
   0.857,
   0.8952,
   0.8792,
   0.9094,
   0.9255,
   0.8781,
   0.8771,
   0.8859,
   0.887,
   0.8761,
   0.8776,
   0.877,
   0.8988,
   0.9017,
   0.8975,
   0.8906,
   0.8576,
   0.8618,
   0.9094,
   0.8976,
   0.8774,
   0.8928,
   0.9042,
   0.9087,
   0.8812,
   0.8953,
   0.8982,
   0.8714,
   0.8822,
   0.8822,
   0.8729,
   0.8507,
   0.8867,
   0.8623,
   0.8673,
   0.8936,
   0.8942,
   0.5145,
   0.8911,
   0.8839,
   0.8651,
   0.55,
   0.8892,
   0.8071,
   0.8871,
   0.8744,
   0.8919,
   0.8872,
   0.8664,
   0.8684,
   0.8678,
   0.8534,
   0.8933,
   0.9026,
   0.8778,
   0.8916,
   0.8733,
   0.8816,
   0.8862,
   0.8735,
   0.8905,
   0.8847,
   0.8916,
   0.9182,
   0.8643,
   0.8571,
   0.8707,
   0.8794,
   0.9045,
   0.8893,
   0.8839,
   0.8963,
   0.8972,
   0.8994,
   0.8825,
   0.8812,
   0.5436,
   0.8976,
   0.9028,
   0.8978,
   0.9117,
   0.8659,
   0.9253,
   0.8749,
   0.8857,
   0.9078,
   0.8736,
   0.8994,
   0.893,
   0.8772,
   0.8738,
   0.884,
   0.8697,
   0.8832,
   0.8829,
   0.8739,
   0.8806,
   0.8758,
   0.8632,
   0.8876,
   0.8682,
   0.9122,
   0.8977,
   0.8853,
   0.8831,
   0.8932,
   0.9033,
   0.8941,
   0.9186,
   0.8632,
   0.8766,
   0.889,
   0.8926,
   0.8744,
   0.9071,
   0.8598,
   0.8469,
   0.8801,
   0.8949,
   0.9228,
   0.887,
   0.888,
   0.8724,
   0.8985,
   0.8695,
   0.5058,
   0.8928,
   0.8478,
   0.8648,
   0.8951,
   0.8857,
   0.8959,
   0.897,
   0.9056,
   0.5739,
   0.8918,
   0.8887,
   0.8946,
   0.8895,
   0.882,
   0.8888,
   0.9105,
   0.8802,
   0.8802,
   0.8741,
   0.8856,
   0.905,
   0.8833,
   0.8986,
   0.8943,
   0.8859,
   0.8893,
   0.9017,
   0.8708,
   0.8998,
   0.8991,
   0.8981,
   0.9091,
   0.8725,
   0.8812,
   0.8927,
   0.8983,
   0.8955,
   0.8579,
   0.8899,
   0.8851,
   0.8872,
   0.8904,
   0.8769,
   0.7541,
   0.8586,
   0.8929,
   0.8888,
   0.9017,
   0.8822,
   0.9338,
   0.8903,
   0.5496,
   0.8634,
   0.9043,
   0.8925,
   0.8898,
   0.9238,
   0.5198,
   0.8531,
   0.9038,
   0.8591,
   0.8978,
   0.8736,
   0.8896,
   0.8845,
   0.8888,
   0.9213,
   0.8878,
   0.8693,
   0.8277,
   0.8939,
   0.8829,
   0.8584,
   0.881,
   0.8582,
   0.9187,
   0.8917,
   0.8933,
   0.9188,
   0.9061,
   0.8896,
   0.8965,
   0.8807,
   0.8767,
   0.902,
   0.8966,
   0.8612,
   0.8736,
   0.8994,
   0.9032,
   0.8798,
   0.8948,
   0.881,
   0.8764,
   0.8759,
   0.752,
   0.8801,
   0.8878,
   0.8929,
   0.8866,
   0.9077,
   0.8989,
   0.9044,
   0.8875,
   0.874,
   0.5582,
   0.8732,
   0.891,
   0.9044,
   0.8912,
   0.8832,
   0.8898,
   0.8777,
   0.8853,
   0.8911,
   0.9065,
   0.8736,
   0.8868,
   0.884,
   0.8544,
   0.8919,
   0.7337,
   0.8767,
   0.8754,
   0.8876,
   0.8769,
   0.9009,
   0.8938,
   0.8944,
   0.8877,
   0.8774,
   0.9009,
   0.8995,
   0.9052,
   0.8748,
   0.8549,
   0.906,
   0.8852,
   0.8938,
   0.8694,
   0.8849,
   0.8572,
   0.866,
   0.8647,
   0.8621,
   0.8668,
   0.9009,
   0.8794,
   0.9035,
   0.9084,
   0.8513,
   0.8762,
   0.906,
   0.8888,
   0.8986,
   0.8784,
   0.9017,
   0.9014,
   0.889,
   0.8821,
   0.8674,
   0.8887,
   0.8794,
   0.8957,
   0.8706,
   0.5404,
   0.8776,
   0.9078,
   0.4931,
   0.8812,
   0.8903,
   0.8896,
   0.8893,
   0.6,
   0.8886,
   0.8898,
   0.904,
   0.8711,
   0.8499,
   0.8785,
   0.8774,
   0.8603,
   0.885,
   0.8922,
   0.9002,
   0.8667,
   0.8661,
   0.8997,
   0.8865,
   0.8776,
   0.8915,
   0.6385,
   0.8508,
   0.9052,
   0.8972,
   0.8963,
   0.8541
  ],
  "shared_factor_var_explained": 0.13657095252954204,
  "shared_factor_agreement_with_scca": 0.6612607679416299,
  "simulation": {
   "n_true": 40,
   "signal": 1.0,
   "seed": 1337,
   "anchor": "laa950_pct"
  },
  "honest_label": "validated on simulated methylation only; no real molecular data were supplied with the challenge",
  "top_cpgs": [
   {
    "cpg": "cg0000026",
    "weight": 0.2377,
    "is_true": true
   },
   {
    "cpg": "cg0000025",
    "weight": 0.2348,
    "is_true": true
   },
   {
    "cpg": "cg0000004",
    "weight": -0.2201,
    "is_true": true
   },
   {
    "cpg": "cg0000022",
    "weight": 0.219,
    "is_true": true
   },
   {
    "cpg": "cg0000023",
    "weight": 0.2189,
    "is_true": true
   },
   {
    "cpg": "cg0000024",
    "weight": 0.2145,
    "is_true": true
   },
   {
    "cpg": "cg0000038",
    "weight": -0.2099,
    "is_true": true
   },
   {
    "cpg": "cg0000017",
    "weight": -0.2023,
    "is_true": true
   },
   {
    "cpg": "cg0000003",
    "weight": -0.2016,
    "is_true": true
   },
   {
    "cpg": "cg0000005",
    "weight": -0.1998,
    "is_true": true
   },
   {
    "cpg": "cg0000029",
    "weight": 0.1891,
    "is_true": true
   },
   {
    "cpg": "cg0000020",
    "weight": 0.1832,
    "is_true": true
   },
   {
    "cpg": "cg0000021",
    "weight": 0.1749,
    "is_true": true
   },
   {
    "cpg": "cg0000016",
    "weight": -0.1736,
    "is_true": true
   },
   {
    "cpg": "cg0000033",
    "weight": -0.173,
    "is_true": true
   },
   {
    "cpg": "cg0000034",
    "weight": -0.1716,
    "is_true": true
   },
   {
    "cpg": "cg0000032",
    "weight": -0.1694,
    "is_true": true
   },
   {
    "cpg": "cg0000015",
    "weight": -0.1525,
    "is_true": true
   },
   {
    "cpg": "cg0000001",
    "weight": -0.1521,
    "is_true": true
   },
   {
    "cpg": "cg0000010",
    "weight": -0.1488,
    "is_true": true
   },
   {
    "cpg": "cg0000031",
    "weight": -0.1448,
    "is_true": true
   },
   {
    "cpg": "cg0000000",
    "weight": -0.1435,
    "is_true": true
   },
   {
    "cpg": "cg0000008",
    "weight": -0.1373,
    "is_true": true
   },
   {
    "cpg": "cg0000014",
    "weight": -0.137,
    "is_true": true
   },
   {
    "cpg": "cg0000011",
    "weight": -0.1317,
    "is_true": true
   }
  ],
  "block_loadings": [
   {
    "variable": "age",
    "weight": -0.0303
   },
   {
    "variable": "sex_female",
    "weight": 0.0181
   },
   {
    "variable": "bmi",
    "weight": -0.183
   },
   {
    "variable": "pack_years",
    "weight": -0.1309
   },
   {
    "variable": "fev1_pp_gli",
    "weight": 0.7486
   },
   {
    "variable": "fev1_fvc_ratio",
    "weight": 0.5752
   },
   {
    "variable": "laa950_pct",
    "weight": -0.1172
   },
   {
    "variable": "perc15_hu",
    "weight": 0.0613
   },
   {
    "variable": "aw_dysanapsis",
    "weight": 0.1896
   },
   {
    "variable": "aw_pi10_mm",
    "weight": 0.0592
   }
  ]
 },
 "inventory": {
  "n_series": 193,
  "n_usable_ct": 83,
  "n_subjects": 14,
  "kernels": {
   "STANDARD": 52,
   "BONEPLUS": 26,
   "DETAIL": 3,
   "BONE": 1,
   "LUNG": 1
  },
  "slice_thickness": {
   "1.25": 52,
   "3.0": 18,
   "2.5": 6,
   "5.0": 3,
   "2.0": 2,
   "0.62": 2
  },
  "manufacturer": {
   "GE MEDICAL SYSTEMS": 83
  },
  "expiratory_detected": true
 },
 "figures": [
  {
   "id": "S91a68122fe",
   "file": "figures/S91a68122fe.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "control",
   "dfev1": null
  },
  {
   "id": "Sbe6ab81b33",
   "file": "figures/Sbe6ab81b33.png",
   "study_index": 0,
   "n_studies": 2,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -73.1
  },
  {
   "id": "Se462ddcc2e",
   "file": "figures/Se462ddcc2e.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "control",
   "dfev1": 2.8
  },
  {
   "id": "Sfd1610ea47",
   "file": "figures/Sfd1610ea47.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "control",
   "dfev1": -62.2
  },
  {
   "id": "Se31feffa69",
   "file": "figures/Se31feffa69.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "control",
   "dfev1": -20.7
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade.png",
   "study_index": 1,
   "n_studies": 6,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.745,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade_t0.png",
   "study_index": 0,
   "n_studies": 6,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade_t2.png",
   "study_index": 2,
   "n_studies": 6,
   "is_primary": false,
   "contrast": false,
   "years_from_first_ct": 1.747,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade_t3.png",
   "study_index": 3,
   "n_studies": 6,
   "is_primary": false,
   "contrast": false,
   "years_from_first_ct": 3.411,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade_t4.png",
   "study_index": 4,
   "n_studies": 6,
   "is_primary": false,
   "contrast": false,
   "years_from_first_ct": 5.385,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S763d941ade",
   "file": "figures/S763d941ade_t5.png",
   "study_index": 5,
   "n_studies": 6,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 8.244,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -107.4
  },
  {
   "id": "S7d0651e5c1",
   "file": "figures/S7d0651e5c1.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "control",
   "dfev1": -25.7
  },
  {
   "id": "S7eb57fe4cb",
   "file": "figures/S7eb57fe4cb.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": 68.0
  },
  {
   "id": "S408804cb65",
   "file": "figures/S408804cb65.png",
   "study_index": 1,
   "n_studies": 3,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 3.912,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 94.4
  },
  {
   "id": "S408804cb65",
   "file": "figures/S408804cb65_t0.png",
   "study_index": 0,
   "n_studies": 3,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 94.4
  },
  {
   "id": "S408804cb65",
   "file": "figures/S408804cb65_t2.png",
   "study_index": 2,
   "n_studies": 3,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 6.691,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 94.4
  },
  {
   "id": "S48da29b7fb",
   "file": "figures/S48da29b7fb.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": true,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": 97.0
  },
  {
   "id": "S71d99defd7",
   "file": "figures/S71d99defd7.png",
   "study_index": 0,
   "n_studies": 5,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -40.7
  },
  {
   "id": "S71d99defd7",
   "file": "figures/S71d99defd7_t1.png",
   "study_index": 1,
   "n_studies": 5,
   "is_primary": false,
   "contrast": false,
   "years_from_first_ct": 4.331,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -40.7
  },
  {
   "id": "S71d99defd7",
   "file": "figures/S71d99defd7_t2.png",
   "study_index": 2,
   "n_studies": 5,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 4.674,
   "has_airway": true,
   "kernel": "BONEPLUS",
   "slice_thickness": 2.5,
   "group": "COPD",
   "dfev1": -40.7
  },
  {
   "id": "S71d99defd7",
   "file": "figures/S71d99defd7_t3.png",
   "study_index": 3,
   "n_studies": 5,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 6.746,
   "has_airway": true,
   "kernel": "BONEPLUS",
   "slice_thickness": 2.5,
   "group": "COPD",
   "dfev1": -40.7
  },
  {
   "id": "S71d99defd7",
   "file": "figures/S71d99defd7_t4.png",
   "study_index": 4,
   "n_studies": 5,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 8.742,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "COPD",
   "dfev1": -40.7
  },
  {
   "id": "S65f2b16659",
   "file": "figures/S65f2b16659.png",
   "study_index": 0,
   "n_studies": 1,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 71.6
  },
  {
   "id": "S07ec2277c2",
   "file": "figures/S07ec2277c2.png",
   "study_index": 1,
   "n_studies": 2,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 2.875,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 24.1
  },
  {
   "id": "S07ec2277c2",
   "file": "figures/S07ec2277c2_t0.png",
   "study_index": 0,
   "n_studies": 2,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": 24.1
  },
  {
   "id": "Sf366741a50",
   "file": "figures/Sf366741a50.png",
   "study_index": 0,
   "n_studies": 3,
   "is_primary": true,
   "contrast": false,
   "years_from_first_ct": 0.0,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": -40.0
  },
  {
   "id": "Sf366741a50",
   "file": "figures/Sf366741a50_t1.png",
   "study_index": 1,
   "n_studies": 3,
   "is_primary": false,
   "contrast": true,
   "years_from_first_ct": 0.608,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": -40.0
  },
  {
   "id": "Sf366741a50",
   "file": "figures/Sf366741a50_t2.png",
   "study_index": 2,
   "n_studies": 3,
   "is_primary": false,
   "contrast": false,
   "years_from_first_ct": 2.71,
   "has_airway": true,
   "kernel": "STANDARD",
   "slice_thickness": 1.25,
   "group": "pre-COPD",
   "dfev1": -40.0
  }
 ],
 "decision_rules": [
  "Imaging that does not beat clinical by more than the paired-bootstrap delta CI is reported as a negative result.",
  "A delta CI that crosses zero is 'indistinguishable on this cohort'. Full stop.",
  "Fewer than 30 imaged subjects: no discrimination metrics. Medians, IQRs, effect sizes, exact tests.",
  "If the cluster is unusable, tier A alone is a complete submission."
 ],
 "limitations": [
  "2 incident COPD cases: incident COPD is not an endpoint here. Accelerated decline (dFEV1 <= -60 mL/yr) is the pre-registered substitute.",
  "The pre-COPD label is partly CT-defined (radiologist's emphysema read), so 'CT recovers the groups' is not independent validation. Within-group ordering is.",
  "dFEV1 spans roughly -220 to +220 mL/yr over 2.9-9.6 years; part of that is measurement noise. The threshold is a population instrument, not a per-patient verdict.",
  "Baseline age is an integer and follow-up age is decimal, so every follow-up interval carries up to half a year of rounding.",
  "Dysanapsis and Pi10 are automated proxies (geodesic depth band, half-max ray casting at 1 mm), not the atlas-based published definitions. Dysanapsis lands in the published 0.02-0.04 range; Pi10 reads about twice the literature value because 1 mm voxels blur a 1 mm wall, so only its ordering is used.",
  "Scanner kernel and slice thickness can exceed the pre-COPD effect; the manifest is shown, the effect is not harmonised away.",
  "No methylation data were supplied. The molecular workflow is validated on simulated CpGs only."
 ]
};
