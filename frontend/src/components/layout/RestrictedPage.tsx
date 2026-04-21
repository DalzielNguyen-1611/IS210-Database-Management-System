import { useNavigate } from "react-router-dom"; // Sửa lại import chuẩn của React Router
import { ShieldOff, ArrowLeft, Lock } from "lucide-react";
import { useAuth, roleConfig } from "../../context/AuthContext";

export function RestrictedPage({ moduleName }: { moduleName?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const config = user ? roleConfig[user.role] : null;

  return (
    <div className="flex items-center justify-center min-h-screen px-8">
      {/* Frosted glass overlay panel */}
      <div
        className="max-w-md w-full rounded-3xl p-12 text-center relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 24px 60px rgba(61,26,46,0.12)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
            top: -60,
            right: -60,
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 150,
            height: 150,
            background: "radial-gradient(circle, rgba(244,143,177,0.08) 0%, transparent 70%)",
            bottom: -40,
            left: -40,
            borderRadius: "50%",
          }}
        />

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
          style={{
            background: "linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.05))",
            border: "2px solid rgba(244,63,94,0.2)",
            boxShadow: "0 8px 24px rgba(244,63,94,0.1)",
          }}
        >
          <ShieldOff size={36} color="#f43f5e" strokeWidth={1.5} />
          <div
            className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f43f5e, #dc2626)", boxShadow: "0 4px 12px rgba(244,63,94,0.4)" }}
          >
            <Lock size={13} color="white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text */}
        <h2 style={{ color: "#3d1a2e", fontSize: "20px", fontWeight: 700, marginBottom: 8 }}>
          Access Restricted
        </h2>
        {moduleName && (
          <p style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 600, marginBottom: 10 }}>
            {moduleName}
          </p>
        )}
        <p style={{ color: "#9d6b7a", fontSize: "13px", lineHeight: 1.7, marginBottom: 6 }}>
          You don't have permission to access this section.
        </p>

        {/* Role Badge */}
        {user && config && (
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mt-2 mb-6" 
            style={{ 
              background: config.color + "20", 
              border: "1px solid " + config.color + "40" 
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: config.color }} />
            <span style={{ color: config.color, fontSize: "12px", fontWeight: 600 }}>
              {config.label} — {user.username}
            </span>
          </div>
        )}

        <p style={{ color: "#c9a0b0", fontSize: "12px", marginBottom: 24, lineHeight: 1.6 }}>
          Your current role does not have clearance for this module. Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#92740d",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <button
            onClick={() => {
              if (user) {
                const cfg = roleConfig[user.role];
                navigate(cfg.defaultPath, { replace: true });
              }
            }}
            className="flex-1 py-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #C9A94E)",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}