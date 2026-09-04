# part1
LECTURER
   1
   │
   │ submits
   │
   ∞
CLAIM
   1
   │
   │ has
   │
   ∞
SUPPORTING_DOCUMENT
LECTURER
LecturerID (PK)
    │
    │ 1
    │
    └──────────────< ∞
                     CLAIM
                  ClaimID (PK)
                  LecturerID (FK)
                  HoursWorked
                  HourlyRate
                  TotalAmount
                  ClaimStatus
                  DateSubmitted
                     │
                     │ 1
                     │
                     └──────────────< ∞
                                      SUPPORTING_DOCUMENT
                                      DocumentID (PK)
                                      ClaimID (FK)
                                      FileName
                                      FilePath
                                      UploadDate


COORDINATOR ────────── reviews/verifies ────────── CLAIM

MANAGER ────────────── approves/rejects ────────── CLAIM
i did not use javascript i needed it just to show the GUI prototype 
