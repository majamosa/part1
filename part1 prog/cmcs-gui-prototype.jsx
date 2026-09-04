import { useState, useMemo } from "react";
import {
  LayoutDashboard, FileText, Upload, LogOut, ChevronRight, Check, X,
  Plus, Trash2, Pencil, Clock, Users, ShieldCheck, Landmark, Search,
  FileCheck2, FileClock, FileX2, ArrowLeft, Paperclip
} from "lucide-react";

const INK = "#1C2B3A";
const PAPER = "#F7F5F0";
const BRASS = "#A8823C";
const FOREST = "#3E6B52";
const CLAY = "#A6472F";
const SLATE = "#6B7580";

const serif = { fontFamily: "'Source Serif 4', Georgia, serif" };

const initialLecturers = [
  { id: "L-001", name: "Dr. Naledi Khumalo", email: "n.khumalo@university.ac.za", department: "Computer Science" },
  { id: "L-002", name: "Mr. Sipho Dlamini", email: "s.dlamini@university.ac.za", department: "Mathematics" },
];

const initialCoordinator = { id: "C-001", name: "Ms. Rebecca van Wyk", email: "r.vanwyk@university.ac.za" };
const initialManager = { id: "M-001", name: "Prof. Thabo Mokoena", email: "t.mokoena@university.ac.za" };

const initialClaims = [
  {
    id: "CLM-1001", lecturerId: "L-001", hoursWorked: 42, hourlyRate: 480,
    status: "Pending Verification", dateSubmitted: "2026-08-04",
    comments: [], documents: [{ id: "D-1", fileName: "timesheet_august.pdf" }],
  },
  {
    id: "CLM-1002", lecturerId: "L-001", hoursWorked: 36, hourlyRate: 480,
    status: "Verified", dateSubmitted: "2026-07-03",
    comments: [{ from: "Coordinator", text: "Hours match the departmental log." }],
    documents: [{ id: "D-2", fileName: "timesheet_july.pdf" }],
  },
  {
    id: "CLM-1003", lecturerId: "L-002", hoursWorked: 28, hourlyRate: 410,
    status: "Approved", dateSubmitted: "2026-06-02",
    comments: [
      { from: "Coordinator", text: "Verified against attendance register." },
      { from: "Manager", text: "Approved for June payroll run." },
    ],
    documents: [{ id: "D-3", fileName: "timesheet_june.pdf" }],
  },
  {
    id: "CLM-1004", lecturerId: "L-002", hoursWorked: 55, hourlyRate: 410,
    status: "Rejected", dateSubmitted: "2026-08-01",
    comments: [{ from: "Coordinator", text: "Hours exceed the contracted monthly cap. Please resubmit with a breakdown." }],
    documents: [],
  },
];

function formatZAR(n) {
  return "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statusTone(status) {
  if (status === "Approved") return { fg: FOREST, bg: "#E7EFE9" };
  if (status === "Rejected") return { fg: CLAY, bg: "#F4E7E2" };
  if (status === "Verified") return { fg: BRASS, bg: "#F5EBD9" };
  return { fg: SLATE, bg: "#EDECE7" };
}

function StatusPill({ status }) {
  const tone = statusTone(status);
  return (
    <span style={{
      color: tone.fg, background: tone.bg, fontSize: 12.5, fontWeight: 600,
      padding: "3px 10px", borderRadius: 3, whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

function Sidebar({ role, name, onNav, active, onSwitchRole, onLogout }) {
  const navByRole = {
    Lecturer: [
      { key: "dashboard", label: "My claims", icon: LayoutDashboard },
      { key: "submit", label: "Submit a claim", icon: Plus },
      { key: "profile", label: "Profile", icon: Users },
    ],
    Coordinator: [
      { key: "pending", label: "Pending claims", icon: FileClock },
      { key: "all", label: "All claims", icon: FileText },
    ],
    Manager: [
      { key: "verified", label: "Verified claims", icon: FileCheck2 },
      { key: "all", label: "All claims", icon: FileText },
    ],
  };
  const icon = role === "Lecturer" ? Users : role === "Coordinator" ? ShieldCheck : Landmark;
  const Icon = icon;
  return (
    <div style={{
      width: 240, minWidth: 240, background: INK, color: "#EDEAE1",
      display: "flex", flexDirection: "column", padding: "22px 18px",
      minHeight: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 34 }}>
        <div style={{
          width: 34, height: 34, border: `1.5px solid ${BRASS}`, borderRadius: 3,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Landmark size={17} color={BRASS} />
        </div>
        <div>
          <div style={{ ...serif, fontSize: 15, lineHeight: 1.15 }}>Contract Monthly</div>
          <div style={{ ...serif, fontSize: 15, lineHeight: 1.15 }}>Claim System</div>
        </div>
      </div>

      <div style={{ fontSize: 11, letterSpacing: 0.4, color: "#8B93A0", marginBottom: 8 }}>
        SIGNED IN AS
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #33445A" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: "#33445A",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={15} color="#D8CDB2" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontSize: 12, color: "#9AA3B0" }}>{role}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navByRole[role].map((item) => {
          const ItemIcon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                background: isActive ? "#2A3B4F" : "transparent",
                border: "none", borderLeft: isActive ? `2px solid ${BRASS}` : "2px solid transparent",
                color: isActive ? "#F5F1E6" : "#C7CAD1", fontSize: 13.5, textAlign: "left",
                cursor: "pointer", borderRadius: 0,
              }}
            >
              <ItemIcon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #33445A", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 11, color: "#8B93A0", marginBottom: 2 }}>Demo: switch role</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Lecturer", "Coordinator", "Manager"].map((r) => (
            <button
              key={r}
              onClick={() => onSwitchRole(r)}
              style={{
                flex: 1, fontSize: 11.5, padding: "6px 4px", borderRadius: 3,
                border: `1px solid ${role === r ? BRASS : "#3B4C63"}`,
                background: role === r ? "rgba(168,130,60,0.18)" : "transparent",
                color: role === r ? "#F0DEB4" : "#9AA3B0", cursor: "pointer",
              }}
            >{r}</button>
          ))}
        </div>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 6, background: "transparent",
          border: "none", color: "#9AA3B0", fontSize: 13, cursor: "pointer", padding: "8px 2px",
        }}>
          <LogOut size={15} /> Log out
        </button>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle }) {
  return (
    <div style={{ padding: "26px 36px 18px", borderBottom: `1px solid #E3E0D6` }}>
      <h1 style={{ ...serif, fontSize: 24, margin: 0, color: INK, fontWeight: 600 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13.5, color: SLATE, margin: "5px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function ClaimsTable({ claims, lecturers, onOpen, showLecturer = true }) {
  if (claims.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: SLATE, fontSize: 13.5 }}>
        No claims to show here yet.
      </div>
    );
  }
  const lecturerName = (id) => lecturers.find((l) => l.id === id)?.name ?? id;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead>
        <tr style={{ textAlign: "left", color: SLATE, fontSize: 12 }}>
          <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6` }}>Claim</th>
          {showLecturer && <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6` }}>Lecturer</th>}
          <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6` }}>Submitted</th>
          <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6`, textAlign: "right" }}>Hours</th>
          <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6`, textAlign: "right" }}>Total</th>
          <th style={{ padding: "9px 6px", fontWeight: 500, borderBottom: `1px solid #E3E0D6` }}>Status</th>
          <th style={{ padding: "9px 6px", borderBottom: `1px solid #E3E0D6` }}></th>
        </tr>
      </thead>
      <tbody>
        {claims.map((c) => (
          <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => onOpen(c.id)}>
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4", fontWeight: 600, color: INK }}>{c.id}</td>
            {showLecturer && <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4" }}>{lecturerName(c.lecturerId)}</td>}
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4", color: SLATE }}>{c.dateSubmitted}</td>
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4", textAlign: "right" }}>{c.hoursWorked}</td>
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4", textAlign: "right", fontWeight: 600 }}>{formatZAR(c.hoursWorked * c.hourlyRate)}</td>
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4" }}><StatusPill status={c.status} /></td>
            <td style={{ padding: "11px 6px", borderBottom: "1px solid #EEECE4", textAlign: "right" }}><ChevronRight size={15} color={SLATE} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E3E0D6", borderRadius: 4, padding: "18px 20px", ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E3E0D6", borderRadius: 4, padding: "16px 18px", flex: 1 }}>
      <div style={{ fontSize: 12, color: SLATE, marginBottom: 6 }}>{label}</div>
      <div style={{ ...serif, fontSize: 24, color: tone || INK, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%", padding: "9px 10px", fontSize: 13.5, border: "1px solid #D7D3C7",
    borderRadius: 3, background: "#fff", boxSizing: "border-box", color: INK,
  };
}
function labelStyle() {
  return { display: "block", fontSize: 12.5, color: SLATE, marginBottom: 5, fontWeight: 600 };
}
function btnPrimary() {
  return {
    background: INK, color: "#F5F1E6", border: "none", padding: "9px 16px",
    fontSize: 13.5, borderRadius: 3, cursor: "pointer", fontWeight: 600,
  };
}
function btnGhost() {
  return {
    background: "transparent", color: INK, border: "1px solid #D7D3C7", padding: "9px 16px",
    fontSize: 13.5, borderRadius: 3, cursor: "pointer", fontWeight: 600,
  };
}
function btnDanger() {
  return {
    background: "#fff", color: CLAY, border: `1px solid ${CLAY}`, padding: "8px 14px",
    fontSize: 13, borderRadius: 3, cursor: "pointer", fontWeight: 600,
  };
}
function btnApprove() {
  return {
    background: FOREST, color: "#fff", border: "none", padding: "9px 16px",
    fontSize: 13.5, borderRadius: 3, cursor: "pointer", fontWeight: 600,
  };
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("n.khumalo@university.ac.za");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Lecturer");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password.");
      return;
    }
    setError("");
    onLogin(role);
  }

  return (
    <div style={{
      minHeight: "100vh", background: PAPER, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: 400, maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 46, height: 46, border: `1.5px solid ${BRASS}`, borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          }}>
            <Landmark size={22} color={BRASS} />
          </div>
          <h1 style={{ ...serif, fontSize: 22, color: INK, margin: "0 0 4px", fontWeight: 600 }}>Contract Monthly Claim System</h1>
          <p style={{ fontSize: 13, color: SLATE, margin: 0 }}>A register for submitting and approving contract lecturer hours.</p>
        </div>

        <Card>
          <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "1px solid #E3E0D6" }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, background: "transparent", border: "none", padding: "8px 0",
                fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                color: mode === m ? INK : SLATE,
                borderBottom: mode === m ? `2px solid ${BRASS}` : "2px solid transparent",
                marginBottom: -1,
              }}>{m === "login" ? "Log in" : "Register as lecturer"}</button>
            ))}
          </div>

          <form onSubmit={submit}>
            {mode === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle()}>Full name</label>
                <input style={inputStyle()} placeholder="Dr. Naledi Khumalo" />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle()}>Email</label>
              <input style={inputStyle()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.ac.za" />
            </div>
            <div style={{ marginBottom: mode === "login" ? 8 : 14 }}>
              <label style={labelStyle()}>Password</label>
              <input style={inputStyle()} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {mode === "login" && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle()}>Demo role (for this prototype)</label>
                <select style={inputStyle()} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Lecturer</option>
                  <option>Coordinator</option>
                  <option>Manager</option>
                </select>
              </div>
            )}

            {error && <div style={{ color: CLAY, fontSize: 13, marginBottom: 12 }}>{error}</div>}

            <button type="submit" style={{ ...btnPrimary(), width: "100%", padding: "10px 0" }}>
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </Card>
        <p style={{ textAlign: "center", fontSize: 12, color: SLATE, marginTop: 16 }}>
          Prototype interface — no data leaves this screen.
        </p>
      </div>
    </div>
  );
}

function ClaimDetail({ claim, lecturer, role, onBack, onVerify, onReject, onApprove, onDelete }) {
  const [comment, setComment] = useState("");
  const total = claim.hoursWorked * claim.hourlyRate;

  function needsComment(action) {
    if (!comment.trim()) return true;
    action();
    setComment("");
  }

  return (
    <div style={{ padding: "26px 36px", maxWidth: 760 }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
        color: SLATE, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 18,
      }}>
        <ArrowLeft size={15} /> Back to claims
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ ...serif, fontSize: 21, color: INK, margin: "0 0 4px", fontWeight: 600 }}>{claim.id}</h2>
          <p style={{ fontSize: 13, color: SLATE, margin: 0 }}>{lecturer?.name} · {lecturer?.department}</p>
        </div>
        <StatusPill status={claim.status} />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          <div>
            <div style={{ fontSize: 11.5, color: SLATE, marginBottom: 4 }}>Hours worked</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: INK }}>{claim.hoursWorked}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: SLATE, marginBottom: 4 }}>Hourly rate</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: INK }}>{formatZAR(claim.hourlyRate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: SLATE, marginBottom: 4 }}>Total amount</div>
            <div style={{ ...serif, fontSize: 16, fontWeight: 600, color: BRASS }}>{formatZAR(total)}</div>
          </div>
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #EEECE4", fontSize: 12.5, color: SLATE }}>
          Submitted {claim.dateSubmitted}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Supporting documents</div>
        {claim.documents.length === 0 ? (
          <div style={{ fontSize: 13, color: SLATE }}>No documents uploaded for this claim.</div>
        ) : (
          claim.documents.map((d) => (
            <div key={d.id} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
              borderBottom: "1px solid #F0EEE7", fontSize: 13,
            }}>
              <Paperclip size={14} color={SLATE} />
              <span style={{ flex: 1 }}>{d.fileName}</span>
              {role === "Lecturer" && <button style={{ background: "none", border: "none", color: CLAY, cursor: "pointer" }}><Trash2 size={14} /></button>}
            </div>
          ))
        )}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 10 }}>Review history</div>
        {claim.comments.length === 0 ? (
          <div style={{ fontSize: 13, color: SLATE }}>No review comments yet.</div>
        ) : (
          claim.comments.map((c, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < claim.comments.length - 1 ? "1px solid #F0EEE7" : "none" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: BRASS, marginBottom: 2 }}>{c.from}</div>
              <div style={{ fontSize: 13, color: INK }}>{c.text}</div>
            </div>
          ))
        )}
      </Card>

      {role === "Coordinator" && claim.status === "Pending Verification" && (
        <Card>
          <label style={labelStyle()}>Comments</label>
          <textarea style={{ ...inputStyle(), minHeight: 64, marginBottom: 12, resize: "vertical" }}
            value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Note what you checked against the departmental log." />
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnApprove()} onClick={() => needsComment(() => onVerify(claim.id, comment))}>
              <Check size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Verify claim
            </button>
            <button style={btnDanger()} onClick={() => needsComment(() => onReject(claim.id, comment))}>
              <X size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Reject claim
            </button>
          </div>
          {!comment.trim() && <div style={{ fontSize: 12, color: SLATE, marginTop: 8 }}>Add a comment before verifying or rejecting.</div>}
        </Card>
      )}

      {role === "Manager" && claim.status === "Verified" && (
        <Card>
          <label style={labelStyle()}>Comments</label>
          <textarea style={{ ...inputStyle(), minHeight: 64, marginBottom: 12, resize: "vertical" }}
            value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Note the payroll run this claim is approved for." />
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnApprove()} onClick={() => needsComment(() => onApprove(claim.id, comment))}>
              <Check size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Approve claim
            </button>
            <button style={btnDanger()} onClick={() => needsComment(() => onReject(claim.id, comment))}>
              <X size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Reject claim
            </button>
          </div>
          {!comment.trim() && <div style={{ fontSize: 12, color: SLATE, marginTop: 8 }}>Add a comment before approving or rejecting.</div>}
        </Card>
      )}

      {role === "Lecturer" && claim.status === "Pending Verification" && (
        <Card>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnGhost()}><Pencil size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Edit claim</button>
            <button style={btnDanger()} onClick={() => onDelete(claim.id)}>
              <Trash2 size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Withdraw claim
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

function SubmitClaimScreen({ onSubmit }) {
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState("");
  const total = (parseFloat(hours) || 0) * (parseFloat(rate) || 0);

  function submit(e) {
    e.preventDefault();
    const h = parseFloat(hours), r = parseFloat(rate);
    if (!h || h <= 0 || !r || r <= 0) {
      setError("Enter hours worked and an hourly rate greater than zero.");
      return;
    }
    setError("");
    onSubmit(h, r);
    setHours(""); setRate("");
  }

  return (
    <div style={{ padding: "26px 36px", maxWidth: 520 }}>
      <Card>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle()}>Hours worked this month</label>
            <input style={inputStyle()} type="number" min="0" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="42" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle()}>Hourly rate (ZAR)</label>
            <input style={inputStyle()} type="number" min="0" step="10" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="480" />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle()}>Supporting document</label>
            <div style={{
              border: "1px dashed #D7D3C7", borderRadius: 3, padding: "18px 12px",
              textAlign: "center", color: SLATE, fontSize: 13,
            }}>
              <Upload size={18} style={{ marginBottom: 6 }} />
              <div>Attach a timesheet or signed register (PDF).</div>
            </div>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 14px", background: "#F5EBD9", borderRadius: 3, marginBottom: 18,
          }}>
            <span style={{ fontSize: 13, color: "#7A5E28" }}>Total claim amount</span>
            <span style={{ ...serif, fontSize: 18, fontWeight: 600, color: "#7A5E28" }}>{formatZAR(total)}</span>
          </div>
          {error && <div style={{ color: CLAY, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={btnPrimary()}>Submit claim</button>
        </form>
      </Card>
    </div>
  );
}

function ProfileScreen({ lecturer }) {
  const [name, setName] = useState(lecturer.name);
  const [email, setEmail] = useState(lecturer.email);
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: "26px 36px", maxWidth: 480 }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle()}>Full name</label>
          <input style={inputStyle()} value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle()}>Email</label>
          <input style={inputStyle()} value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle()}>Department</label>
          <input style={{ ...inputStyle(), background: "#F5F3EE", color: SLATE }} value={lecturer.department} disabled />
        </div>
        <button style={btnPrimary()} onClick={() => setSaved(true)}>Save changes</button>
        {saved && <span style={{ marginLeft: 12, fontSize: 13, color: FOREST }}>Profile updated.</span>}
      </Card>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [nav, setNav] = useState("dashboard");
  const [openClaimId, setOpenClaimId] = useState(null);
  const [claims, setClaims] = useState(initialClaims);
  const lecturers = initialLecturers;
  const currentLecturer = lecturers[0];

  function login(role) {
    setSession({ role });
    setNav(role === "Lecturer" ? "dashboard" : role === "Coordinator" ? "pending" : "verified");
    setOpenClaimId(null);
  }
  function switchRole(role) {
    setSession({ role });
    setNav(role === "Lecturer" ? "dashboard" : role === "Coordinator" ? "pending" : "verified");
    setOpenClaimId(null);
  }
  function logout() { setSession(null); }

  function submitClaim(hours, rate) {
    const id = "CLM-" + (1000 + claims.length + 1);
    setClaims([{
      id, lecturerId: currentLecturer.id, hoursWorked: hours, hourlyRate: rate,
      status: "Pending Verification", dateSubmitted: new Date().toISOString().slice(0, 10),
      comments: [], documents: [],
    }, ...claims]);
    setNav("dashboard");
  }
  function deleteClaim(id) {
    setClaims(claims.filter((c) => c.id !== id));
    setOpenClaimId(null);
  }
  function verify(id, text) {
    setClaims(claims.map((c) => c.id === id ? { ...c, status: "Verified", comments: [...c.comments, { from: "Coordinator", text }] } : c));
    setOpenClaimId(null);
  }
  function reject(id, text) {
    const from = session.role;
    setClaims(claims.map((c) => c.id === id ? { ...c, status: "Rejected", comments: [...c.comments, { from, text }] } : c));
    setOpenClaimId(null);
  }
  function approve(id, text) {
    setClaims(claims.map((c) => c.id === id ? { ...c, status: "Approved", comments: [...c.comments, { from: "Manager", text }] } : c));
    setOpenClaimId(null);
  }

  const myClaims = useMemo(() => claims.filter((c) => c.lecturerId === currentLecturer.id), [claims]);
  const pendingClaims = useMemo(() => claims.filter((c) => c.status === "Pending Verification"), [claims]);
  const verifiedClaims = useMemo(() => claims.filter((c) => c.status === "Verified"), [claims]);

  if (!session) return <LoginScreen onLogin={login} />;

  const person = session.role === "Lecturer" ? currentLecturer.name
    : session.role === "Coordinator" ? initialCoordinator.name
    : initialManager.name;

  const openClaim = claims.find((c) => c.id === openClaimId);

  let content;
  if (openClaim) {
    content = (
      <ClaimDetail
        claim={openClaim}
        lecturer={lecturers.find((l) => l.id === openClaim.lecturerId)}
        role={session.role}
        onBack={() => setOpenClaimId(null)}
        onVerify={verify}
        onReject={reject}
        onApprove={approve}
        onDelete={deleteClaim}
      />
    );
  } else if (session.role === "Lecturer" && nav === "dashboard") {
    const total = myClaims.reduce((s, c) => s + c.hoursWorked * c.hourlyRate, 0);
    content = (
      <>
        <TopBar title="My claims" subtitle="Claims you have submitted for contracted teaching hours." />
        <div style={{ padding: "20px 36px 0", display: "flex", gap: 14 }}>
          <StatCard label="Claims submitted" value={myClaims.length} />
          <StatCard label="Pending review" value={myClaims.filter((c) => c.status === "Pending Verification").length} tone={SLATE} />
          <StatCard label="Total claimed" value={formatZAR(total)} tone={BRASS} />
        </div>
        <div style={{ padding: "20px 36px" }}>
          <Card>
            <ClaimsTable claims={myClaims} lecturers={lecturers} onOpen={setOpenClaimId} showLecturer={false} />
          </Card>
        </div>
      </>
    );
  } else if (session.role === "Lecturer" && nav === "submit") {
    content = <><TopBar title="Submit a claim" subtitle="Enter hours worked this month and attach supporting evidence." /><SubmitClaimScreen onSubmit={submitClaim} /></>;
  } else if (session.role === "Lecturer" && nav === "profile") {
    content = <><TopBar title="Profile" subtitle="Keep your contact details current for payroll correspondence." /><ProfileScreen lecturer={currentLecturer} /></>;
  } else if (session.role === "Coordinator" && nav === "pending") {
    content = (
      <>
        <TopBar title="Pending claims" subtitle="Claims awaiting verification against departmental records." />
        <div style={{ padding: "20px 36px" }}>
          <Card><ClaimsTable claims={pendingClaims} lecturers={lecturers} onOpen={setOpenClaimId} /></Card>
        </div>
      </>
    );
  } else if (session.role === "Manager" && nav === "verified") {
    content = (
      <>
        <TopBar title="Verified claims" subtitle="Claims cleared by a coordinator, awaiting approval for payroll." />
        <div style={{ padding: "20px 36px" }}>
          <Card><ClaimsTable claims={verifiedClaims} lecturers={lecturers} onOpen={setOpenClaimId} /></Card>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <TopBar title="All claims" subtitle="Every claim in the system, across every status." />
        <div style={{ padding: "20px 36px" }}>
          <Card><ClaimsTable claims={claims} lecturers={lecturers} onOpen={setOpenClaimId} /></Card>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: PAPER, fontFamily: "Inter, system-ui, sans-serif", color: INK }}>
      <Sidebar
        role={session.role}
        name={person}
        active={nav}
        onNav={(k) => { setNav(k); setOpenClaimId(null); }}
        onSwitchRole={switchRole}
        onLogout={logout}
      />
      <div style={{ flex: 1, minWidth: 0 }}>{content}</div>
    </div>
  );
}
