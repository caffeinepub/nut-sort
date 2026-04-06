import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { soundSystem } from "../game/soundSystem";
import { type SaveData, saveSave } from "../game/storage";

interface ShopScreenProps {
  save: SaveData;
  onBack: () => void;
  onSaveUpdate: (save: SaveData) => void;
}

// ─── Background definitions ───────────────────────────────────────────────────

const NORMAL_BACKGROUNDS: { id: string; name: string; gradient: string }[] = [
  {
    id: "sky_blue",
    name: "Sky Blue",
    gradient: "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 40%, #E8F4FF 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    gradient: "linear-gradient(180deg, #FF6B35 0%, #F7C59F 50%, #FFE0C8 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    gradient: "linear-gradient(180deg, #0077B6 0%, #00B4D8 50%, #90E0EF 100%)",
  },
  {
    id: "forest",
    name: "Forest",
    gradient: "linear-gradient(180deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)",
  },
  {
    id: "lavender",
    name: "Lavender",
    gradient: "linear-gradient(180deg, #9D8EC4 0%, #C3B1E1 50%, #E8D5F5 100%)",
  },
  {
    id: "rose_gold",
    name: "Rose Gold",
    gradient: "linear-gradient(180deg, #C9A96E 0%, #E8C4A0 50%, #F5E6D3 100%)",
  },
  {
    id: "mint_fresh",
    name: "Mint Fresh",
    gradient: "linear-gradient(180deg, #00BFA5 0%, #1DE9B6 50%, #A7FFEB 100%)",
  },
  {
    id: "cherry_blossom",
    name: "Cherry Blossom",
    gradient: "linear-gradient(180deg, #FF80AB 0%, #FFB3C6 50%, #FFE4EC 100%)",
  },
  {
    id: "golden_hour",
    name: "Golden Hour",
    gradient: "linear-gradient(180deg, #F9A825 0%, #FDD835 50%, #FFF9C4 100%)",
  },
  {
    id: "deep_ocean",
    name: "Deep Ocean",
    gradient: "linear-gradient(180deg, #003566 0%, #0077B6 50%, #00B4D8 100%)",
  },
  {
    id: "cotton_candy",
    name: "Cotton Candy",
    gradient: "linear-gradient(180deg, #FF9FF3 0%, #FFEAA7 50%, #DDA0DD 100%)",
  },
  {
    id: "arctic",
    name: "Arctic",
    gradient: "linear-gradient(180deg, #E8F4F8 0%, #C8E6F0 50%, #A8D8EA 100%)",
  },
  {
    id: "peach",
    name: "Peach",
    gradient: "linear-gradient(180deg, #FFAD60 0%, #FFD6A5 50%, #FFF0E0 100%)",
  },
  {
    id: "meadow",
    name: "Meadow",
    gradient: "linear-gradient(180deg, #56AB2F 0%, #A8E063 50%, #CCFF90 100%)",
  },
  {
    id: "twilight",
    name: "Twilight",
    gradient: "linear-gradient(180deg, #2C3E50 0%, #3498DB 50%, #85C1E9 100%)",
  },
  {
    id: "coral_reef",
    name: "Coral Reef",
    gradient: "linear-gradient(180deg, #FF4E50 0%, #FC913A 50%, #FFDC9A 100%)",
  },
  {
    id: "night_sky",
    name: "Night Sky",
    gradient: "linear-gradient(180deg, #0D1B2A 0%, #1B2838 50%, #2C3E50 100%)",
  },
  {
    id: "spring",
    name: "Spring",
    gradient: "linear-gradient(180deg, #84FAB0 0%, #8FD3F4 50%, #CFFFEA 100%)",
  },
  {
    id: "desert",
    name: "Desert",
    gradient: "linear-gradient(180deg, #C68642 0%, #E8A87C 50%, #F5D0A9 100%)",
  },
  {
    id: "candy",
    name: "Candy",
    gradient: "linear-gradient(180deg, #FF6EC7 0%, #FF9EBE 50%, #FFD6E7 100%)",
  },
  {
    id: "lime",
    name: "Lime",
    gradient: "linear-gradient(180deg, #7EC850 0%, #BAEA8A 50%, #E8FFD0 100%)",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    gradient: "linear-gradient(180deg, #4B0082 0%, #6A0DAD 50%, #9B59B6 100%)",
  },
  {
    id: "mango",
    name: "Mango",
    gradient: "linear-gradient(180deg, #FF8008 0%, #FFC837 50%, #FFE6A0 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    gradient: "linear-gradient(180deg, #00C9FF 0%, #92FE9D 50%, #C8FFD4 100%)",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    gradient: "linear-gradient(180deg, #FC466B 0%, #FF8A80 50%, #FFCDD2 100%)",
  },
];

const VIP_BACKGROUNDS: { id: string; name: string; gradient: string }[] = [
  {
    id: "galaxy",
    name: "Galaxy",
    gradient:
      "linear-gradient(135deg, #0D0221 0%, #240046 25%, #3C096C 50%, #5A189A 75%, #7B2FBE 100%)",
  },
  {
    id: "neon_city",
    name: "Neon City",
    gradient:
      "linear-gradient(135deg, #0A0A0A 0%, #1A0A2E 30%, #16003E 60%, #0A0A0A 100%)",
  },
  {
    id: "dragon_fire",
    name: "Dragon Fire",
    gradient:
      "linear-gradient(135deg, #1A0000 0%, #8B0000 30%, #DC143C 60%, #FF4500 85%, #FFD700 100%)",
  },
  {
    id: "deep_sea",
    name: "Deep Sea",
    gradient:
      "linear-gradient(135deg, #000428 0%, #004e92 50%, #00B4D8 75%, #90E0EF 100%)",
  },
  {
    id: "aurora_borealis",
    name: "Aurora Borealis",
    gradient:
      "linear-gradient(135deg, #001F0D 0%, #004D25 20%, #00B300 40%, #00CED1 60%, #4169E1 80%, #8A2BE2 100%)",
  },
  {
    id: "volcano",
    name: "Volcano",
    gradient:
      "linear-gradient(135deg, #0D0000 0%, #3D0000 25%, #8B1A1A 50%, #CC3300 75%, #FF6600 100%)",
  },
  {
    id: "cosmic_dream",
    name: "Cosmic Dream",
    gradient:
      "linear-gradient(135deg, #1A1A2E 0%, #16213E 25%, #0F3460 50%, #533483 75%, #E94560 100%)",
  },
  {
    id: "emerald_palace",
    name: "Emerald Palace",
    gradient:
      "linear-gradient(135deg, #001A0D 0%, #003D1C 25%, #006633 50%, #00994D 75%, #00CC66 100%)",
  },
  {
    id: "ruby_throne",
    name: "Ruby Throne",
    gradient:
      "linear-gradient(135deg, #1A0010 0%, #4A0020 25%, #8B0040 50%, #CC0060 75%, #FF0080 100%)",
  },
  {
    id: "golden_empire",
    name: "Golden Empire",
    gradient:
      "linear-gradient(135deg, #1A0F00 0%, #4A2800 25%, #8B5000 50%, #CC8000 75%, #FFB800 100%)",
  },
];

const ADS_STORAGE_KEY = "sortcraft_ads";

function loadAdCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(ADS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAdCounts(counts: Record<string, number>): void {
  try {
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

// ─── Premium plan definitions ─────────────────────────────────────────────────

const PREMIUM_PLANS = [
  {
    id: "week",
    label: "1 Week",
    price: "₹19",
    durationDays: 7,
    popular: false,
  },
  {
    id: "month",
    label: "1 Month",
    price: "₹49",
    durationDays: 30,
    popular: true,
  },
  {
    id: "three_months",
    label: "3 Months",
    price: "₹99",
    durationDays: 90,
    popular: false,
  },
  {
    id: "six_months",
    label: "6 Months",
    price: "₹199",
    durationDays: 180,
    popular: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AdModalProps {
  bgId: string;
  bgName: string;
  onClose: (watched: boolean) => void;
}

const AdModal: React.FC<AdModalProps> = ({ bgId: _bgId, bgName, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      data-ocid="shop.ad_modal"
    >
      <div
        style={{
          background: "#1a1a2e",
          border: "3px solid #FFD700",
          borderRadius: 20,
          padding: 24,
          width: "min(340px, 90vw)",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(255,215,0,0.3)",
        }}
      >
        {/* Ad header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d2d2d, #444)",
            border: "2px solid #555",
            borderRadius: 10,
            padding: "8px 12px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              background: "#666",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              color: "#aaa",
              fontSize: 12,
              fontFamily: "Nunito, sans-serif",
            }}
          >
            ⬛ Advertisement
          </span>
        </div>

        {/* Fake ad banner */}
        <div
          style={{
            height: 120,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, #FF6B35 0%, #FF8E53 30%, #FFD700 60%, #FF6BC1 100%)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <span
            style={{
              color: "white",
              fontFamily: "Fredoka One, Nunito, sans-serif",
              fontSize: 20,
              fontWeight: 900,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            🎮 Play More Games!
          </span>
        </div>

        {done ? (
          <div>
            <div
              style={{
                fontSize: 32,
                marginBottom: 8,
              }}
            >
              ✅
            </div>
            <div
              style={{
                color: "#4CAF50",
                fontFamily: "Fredoka One, Nunito, sans-serif",
                fontSize: 18,
                fontWeight: 900,
                marginBottom: 16,
              }}
            >
              Ad Watched!
            </div>
            <div
              style={{
                color: "#aaa",
                fontSize: 13,
                marginBottom: 16,
                fontFamily: "Nunito, sans-serif",
              }}
            >
              Unlocking {bgName} progress...
            </div>
            <button
              type="button"
              onClick={() => onClose(true)}
              style={{
                background: "linear-gradient(135deg, #4CAF50, #2ED573)",
                border: "3px solid rgba(0,0,0,0.2)",
                borderRadius: 12,
                color: "white",
                fontFamily: "Fredoka One, Nunito, sans-serif",
                fontSize: 16,
                fontWeight: 900,
                padding: "10px 32px",
                cursor: "pointer",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
              }}
              data-ocid="shop.ad_close_button"
            >
              Claim Reward ✨
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                color: "#FFD700",
                fontFamily: "Fredoka One, Nunito, sans-serif",
                fontSize: 20,
                fontWeight: 900,
                marginBottom: 8,
              }}
            >
              Ad ends in: {countdown}s
            </div>
            <div
              style={{
                height: 6,
                background: "#333",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((5 - countdown) / 5) * 100}%`,
                  background: "linear-gradient(90deg, #FFD700, #FF6B35)",
                  transition: "width 1s linear",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DemoModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ title, message, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
    data-ocid="shop.demo_modal"
  >
    <div
      style={{
        background: "white",
        border: "4px solid #FF6B9D",
        borderRadius: 24,
        padding: 28,
        width: "min(320px, 90vw)",
        textAlign: "center",
        boxShadow: "0 8px 0 rgba(0,0,0,0.2), 0 16px 40px rgba(255,107,157,0.3)",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
      <div
        style={{
          fontFamily: "Fredoka One, Nunito, sans-serif",
          fontSize: 20,
          fontWeight: 900,
          color: "#FF6B9D",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: 14,
          color: "#666",
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        {message}
      </div>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: "linear-gradient(135deg, #FF6B9D, #FF8E53)",
          border: "3px solid rgba(0,0,0,0.15)",
          borderRadius: 14,
          color: "white",
          fontFamily: "Fredoka One, Nunito, sans-serif",
          fontSize: 18,
          fontWeight: 900,
          padding: "12px 36px",
          cursor: "pointer",
          boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
        }}
        data-ocid="shop.demo_ok_button"
      >
        OK 👍
      </button>
    </div>
  </div>
);

// ─── Main ShopScreen ──────────────────────────────────────────────────────────

const ShopScreen: React.FC<ShopScreenProps> = ({
  save,
  onBack,
  onSaveUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"premium" | "backgrounds">(
    "premium",
  );
  const [demoModal, setDemoModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [adModal, setAdModal] = useState<{
    bgId: string;
    bgName: string;
  } | null>(null);
  const [adCounts, setAdCounts] = useState<Record<string, number>>(() =>
    loadAdCounts(),
  );

  const isPremiumActive =
    save.premiumUntil !== null && save.premiumUntil > Date.now();

  const handleBuyPremium = useCallback((planId: string) => {
    soundSystem.playClick();
    setDemoModal({
      title: "Payment Coming Soon!",
      message: `Real payment will be added soon. (Demo Mode)\n\nYour plan: ${PREMIUM_PLANS.find((p) => p.id === planId)?.label ?? planId}`,
    });
  }, []);

  const handleSelectBackground = useCallback(
    (_bgId: string, gradient: string) => {
      soundSystem.playClick();
      const updated: SaveData = {
        ...save,
        activeBackground: gradient,
      };
      saveSave(updated);
      onSaveUpdate(updated);
    },
    [save, onSaveUpdate],
  );

  const handleWatchAd = useCallback((bgId: string, bgName: string) => {
    soundSystem.playClick();
    setAdModal({ bgId, bgName });
  }, []);

  const handleAdClose = useCallback(
    (bgId: string, watched: boolean) => {
      setAdModal(null);
      if (!watched) return;

      const newCounts = { ...adCounts, [bgId]: (adCounts[bgId] ?? 0) + 1 };
      setAdCounts(newCounts);
      saveAdCounts(newCounts);

      const adsRequired = VIP_BACKGROUNDS.some((b) => b.id === bgId) ? 4 : 1;
      if (newCounts[bgId] >= adsRequired) {
        // unlock this background
        const bg =
          NORMAL_BACKGROUNDS.find((b) => b.id === bgId) ??
          VIP_BACKGROUNDS.find((b) => b.id === bgId);
        if (!bg) return;
        const alreadyUnlocked = save.unlockedBackgrounds.includes(bgId);
        const updated: SaveData = {
          ...save,
          unlockedBackgrounds: alreadyUnlocked
            ? save.unlockedBackgrounds
            : [...save.unlockedBackgrounds, bgId],
          activeBackground: bg.gradient,
        };
        saveSave(updated);
        onSaveUpdate(updated);
      }
    },
    [adCounts, save, onSaveUpdate],
  );

  const handleBuyVipBg = useCallback((bgName: string) => {
    soundSystem.playClick();
    setDemoModal({
      title: "VIP Background",
      message: `"${bgName}" — Coming Soon!\n\nReal payment will be enabled soon. (Demo Mode)`,
    });
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Nunito, sans-serif",
        overflow: "hidden",
      }}
      data-ocid="shop.page"
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "3px solid rgba(0,0,0,0.2)",
          boxShadow: "0 4px 12px rgba(255,100,120,0.35)",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => {
            soundSystem.playClick();
            onBack();
          }}
          style={{
            background: "linear-gradient(135deg, #fff9e6, #ffe47c)",
            border: "3px solid rgba(0,0,0,0.2)",
            borderRadius: 14,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}
          data-ocid="shop.close_button"
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "Fredoka One, Nunito, sans-serif",
              fontSize: "clamp(1.4rem, 6vw, 2rem)",
              fontWeight: 900,
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "1px",
            }}
          >
            🛒 Shop
          </h1>
        </div>
        {/* Coin display */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFE566, #FFB800)",
            border: "3px solid rgba(0,0,0,0.2)",
            borderRadius: 999,
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 5,
            boxShadow: "0 3px 0 rgba(0,0,0,0.18)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 16 }}>🏆</span>
          <span
            style={{
              color: "#5a3000",
              fontFamily: "Fredoka One, Nunito, sans-serif",
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            {save.totalPoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          background: "rgba(0,0,0,0.3)",
          borderBottom: "2px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}
      >
        {(["premium", "backgrounds"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              soundSystem.playClick();
              setActiveTab(tab);
            }}
            style={{
              flex: 1,
              padding: "14px 8px",
              background:
                activeTab === tab ? "rgba(255,107,157,0.25)" : "transparent",
              border: "none",
              borderBottom:
                activeTab === tab
                  ? "3px solid #FF6B9D"
                  : "3px solid transparent",
              color: activeTab === tab ? "#FF6B9D" : "rgba(255,255,255,0.5)",
              fontFamily: "Fredoka One, Nunito, sans-serif",
              fontSize: 15,
              fontWeight: 900,
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "all 0.2s",
            }}
            data-ocid={`shop.${tab}_tab`}
          >
            {tab === "premium" ? "👑 Remove Ads" : "🎨 Backgrounds"}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
        }}
      >
        {activeTab === "premium" && (
          <PremiumTab
            isPremiumActive={isPremiumActive}
            premiumUntil={save.premiumUntil}
            onBuy={handleBuyPremium}
          />
        )}
        {activeTab === "backgrounds" && (
          <BackgroundsTab
            save={save}
            adCounts={adCounts}
            onSelect={handleSelectBackground}
            onWatchAd={handleWatchAd}
            onBuyVip={handleBuyVipBg}
          />
        )}
      </div>

      {/* Modals */}
      {demoModal && (
        <DemoModal
          title={demoModal.title}
          message={demoModal.message}
          onClose={() => setDemoModal(null)}
        />
      )}
      {adModal && (
        <AdModal
          bgId={adModal.bgId}
          bgName={adModal.bgName}
          onClose={(watched) => handleAdClose(adModal.bgId, watched)}
        />
      )}
    </div>
  );
};

// ─── Premium Tab ──────────────────────────────────────────────────────────────

interface PremiumTabProps {
  isPremiumActive: boolean;
  premiumUntil: number | null;
  onBuy: (planId: string) => void;
}

const PremiumTab: React.FC<PremiumTabProps> = ({
  isPremiumActive,
  premiumUntil,
  onBuy,
}) => {
  const remainingDays = premiumUntil
    ? Math.max(
        0,
        Math.ceil((premiumUntil - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  return (
    <div>
      {/* Header banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
          borderRadius: 20,
          padding: "16px 20px",
          marginBottom: 20,
          textAlign: "center",
          border: "3px solid rgba(0,0,0,0.15)",
          boxShadow: "0 6px 0 rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 4 }}>👑</div>
        <div
          style={{
            fontFamily: "Fredoka One, Nunito, sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: "#5a3000",
          }}
        >
          Remove Ads
        </div>
        <div
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: 13,
            color: "#8B5000",
            marginTop: 4,
          }}
        >
          Enjoy uninterrupted gameplay!
        </div>
        {isPremiumActive && (
          <div
            style={{
              marginTop: 8,
              background: "rgba(0,0,0,0.15)",
              borderRadius: 999,
              padding: "4px 14px",
              display: "inline-block",
              color: "#5a3000",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            ✅ Active · {remainingDays} day{remainingDays !== 1 ? "s" : ""} left
          </div>
        )}
      </div>

      {/* Plan cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {PREMIUM_PLANS.map((plan, idx) => (
          <PremiumCard
            key={plan.id}
            plan={plan}
            isActive={isPremiumActive}
            index={idx + 1}
            onBuy={() => onBuy(plan.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface PremiumCardProps {
  plan: (typeof PREMIUM_PLANS)[0];
  isActive: boolean;
  index: number;
  onBuy: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  plan,
  isActive: _isActive,
  index,
  onBuy,
}) => (
  <div
    style={{
      background: plan.popular
        ? "linear-gradient(135deg, #FFE566 0%, #FF8C00 100%)"
        : "linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%)",
      border: plan.popular
        ? "3px solid #FFD700"
        : "3px solid rgba(255,255,255,0.2)",
      borderRadius: 18,
      padding: "16px 12px",
      textAlign: "center",
      position: "relative",
      boxShadow: plan.popular
        ? "0 6px 0 rgba(0,0,0,0.25), 0 8px 24px rgba(255,200,0,0.3)"
        : "0 4px 0 rgba(0,0,0,0.3)",
    }}
    data-ocid={`shop.premium.item.${index}`}
  >
    {plan.popular && (
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #FF4FD8, #FF6B35)",
          color: "white",
          fontFamily: "Fredoka One, Nunito, sans-serif",
          fontSize: 11,
          fontWeight: 900,
          padding: "3px 12px",
          borderRadius: 999,
          border: "2px solid white",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(255,80,200,0.4)",
        }}
      >
        🔥 Popular
      </div>
    )}
    <div
      style={{
        fontFamily: "Fredoka One, Nunito, sans-serif",
        fontSize: 28,
        fontWeight: 900,
        color: plan.popular ? "#5a3000" : "white",
        marginBottom: 2,
      }}
    >
      {plan.price}
    </div>
    <div
      style={{
        fontFamily: "Nunito, sans-serif",
        fontSize: 13,
        color: plan.popular ? "#8B5000" : "rgba(255,255,255,0.8)",
        fontWeight: 700,
        marginBottom: 14,
      }}
    >
      {plan.label}
    </div>
    <button
      type="button"
      onClick={onBuy}
      style={{
        background: plan.popular
          ? "linear-gradient(135deg, #FF6B35, #FF4500)"
          : "linear-gradient(135deg, #4DE3FF, #0099CC)",
        border: "3px solid rgba(0,0,0,0.2)",
        borderRadius: 12,
        color: "white",
        fontFamily: "Fredoka One, Nunito, sans-serif",
        fontSize: 14,
        fontWeight: 900,
        padding: "8px 16px",
        cursor: "pointer",
        boxShadow: "0 3px 0 rgba(0,0,0,0.25)",
        width: "100%",
      }}
      data-ocid={`shop.premium.buy_button.${index}`}
    >
      Buy Now
    </button>
  </div>
);

// ─── Backgrounds Tab ──────────────────────────────────────────────────────────

interface BackgroundsTabProps {
  save: SaveData;
  adCounts: Record<string, number>;
  onSelect: (bgId: string, gradient: string) => void;
  onWatchAd: (bgId: string, bgName: string) => void;
  onBuyVip: (bgName: string) => void;
}

const BackgroundsTab: React.FC<BackgroundsTabProps> = ({
  save,
  adCounts,
  onSelect,
  onWatchAd,
  onBuyVip,
}) => (
  <div>
    {/* Normal Backgrounds section */}
    <div
      style={{
        background: "linear-gradient(135deg, #2d5986 0%, #1e3a5f 100%)",
        border: "3px solid rgba(255,255,255,0.2)",
        borderRadius: 16,
        padding: "12px 14px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 20 }}>🎨</span>
        <span
          style={{
            fontFamily: "Fredoka One, Nunito, sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "white",
          }}
        >
          Normal Backgrounds
        </span>
        <span
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 700,
          }}
        >
          Watch 1 Ad
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {NORMAL_BACKGROUNDS.map((bg, idx) => {
          const isUnlocked = save.unlockedBackgrounds.includes(bg.id);
          const isActive = save.activeBackground === bg.gradient;
          const adsWatched = adCounts[bg.id] ?? 0;

          return (
            <BgCard
              key={bg.id}
              bg={bg}
              isUnlocked={isUnlocked}
              isActive={isActive}
              adsWatched={adsWatched}
              adsRequired={1}
              isVip={false}
              index={idx + 1}
              onSelect={onSelect}
              onWatchAd={onWatchAd}
              onBuyVip={onBuyVip}
            />
          );
        })}
      </div>
    </div>

    {/* VIP Backgrounds section */}
    <div
      style={{
        background:
          "linear-gradient(135deg, #1A0F00 0%, #4A2800 50%, #8B5000 100%)",
        border: "3px solid #FFD700",
        borderRadius: 16,
        padding: "12px 14px",
        marginBottom: 16,
        boxShadow: "0 0 20px rgba(255,215,0,0.2)",
      }}
    >
      {/* VIP badge header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 20 }}>⭐</span>
        <span
          style={{
            fontFamily: "Fredoka One, Nunito, sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "#FFD700",
            textShadow: "0 0 12px rgba(255,215,0,0.5)",
          }}
        >
          VIP Backgrounds
        </span>
        <span
          style={{
            background: "linear-gradient(135deg, #FFD700, #FF8C00)",
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 12,
            color: "#5a3000",
            fontWeight: 900,
          }}
        >
          ₹29 or 4 Ads
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}
      >
        {VIP_BACKGROUNDS.map((bg, idx) => {
          const isUnlocked = save.unlockedBackgrounds.includes(bg.id);
          const isActive = save.activeBackground === bg.gradient;
          const adsWatched = adCounts[bg.id] ?? 0;

          return (
            <BgCard
              key={bg.id}
              bg={bg}
              isUnlocked={isUnlocked}
              isActive={isActive}
              adsWatched={adsWatched}
              adsRequired={4}
              isVip
              index={idx + 1}
              onSelect={onSelect}
              onWatchAd={onWatchAd}
              onBuyVip={onBuyVip}
            />
          );
        })}
      </div>
    </div>
  </div>
);

// ─── Background Card ──────────────────────────────────────────────────────────

interface BgCardProps {
  bg: { id: string; name: string; gradient: string };
  isUnlocked: boolean;
  isActive: boolean;
  adsWatched: number;
  adsRequired: number;
  isVip: boolean;
  index: number;
  onSelect: (bgId: string, gradient: string) => void;
  onWatchAd: (bgId: string, bgName: string) => void;
  onBuyVip: (bgName: string) => void;
}

const BgCard: React.FC<BgCardProps> = ({
  bg,
  isUnlocked,
  isActive,
  adsWatched,
  adsRequired,
  isVip,
  index,
  onSelect,
  onWatchAd,
  onBuyVip,
}) => (
  <div
    style={{
      background: "rgba(0,0,0,0.3)",
      border: isActive
        ? "3px solid #4CAF50"
        : isVip
          ? "2px solid rgba(255,215,0,0.4)"
          : "2px solid rgba(255,255,255,0.15)",
      borderRadius: 14,
      padding: "10px 8px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
    data-ocid={`shop.bg.item.${index}`}
  >
    {/* Gradient preview swatch */}
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 12,
        background: bg.gradient,
        border: "2px solid rgba(255,255,255,0.3)",
        flexShrink: 0,
        boxShadow: isVip ? "0 0 12px rgba(255,215,0,0.4)" : undefined,
        position: "relative",
      }}
    >
      {isVip && (
        <div
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "#FFD700",
            borderRadius: 999,
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            border: "1px solid rgba(0,0,0,0.2)",
          }}
        >
          ⭐
        </div>
      )}
    </div>

    {/* Name */}
    <div
      style={{
        fontFamily: "Nunito, sans-serif",
        fontSize: 10,
        fontWeight: 800,
        color: isVip ? "#FFD700" : "rgba(255,255,255,0.9)",
        lineHeight: 1.2,
        textAlign: "center",
      }}
    >
      {bg.name}
    </div>

    {/* Action button */}
    {isUnlocked ? (
      <button
        type="button"
        onClick={() => onSelect(bg.id, bg.gradient)}
        style={{
          background: isActive
            ? "linear-gradient(135deg, #4CAF50, #2ED573)"
            : "linear-gradient(135deg, #2196F3, #0077B6)",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: 8,
          color: "white",
          fontFamily: "Fredoka One, Nunito, sans-serif",
          fontSize: 10,
          fontWeight: 900,
          padding: "5px 8px",
          cursor: isActive ? "default" : "pointer",
          width: "100%",
          boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
        }}
        disabled={isActive}
        data-ocid={`shop.bg.select_button.${index}`}
      >
        {isActive ? "✓ Active" : "Use"}
      </button>
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
        }}
      >
        {isVip && (
          <button
            type="button"
            onClick={() => onBuyVip(bg.name)}
            style={{
              background: "linear-gradient(135deg, #FF8C00, #FF6B35)",
              border: "2px solid rgba(0,0,0,0.2)",
              borderRadius: 8,
              color: "white",
              fontFamily: "Fredoka One, Nunito, sans-serif",
              fontSize: 10,
              fontWeight: 900,
              padding: "5px 6px",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
            }}
            data-ocid={`shop.bg.buy_button.${index}`}
          >
            ₹29
          </button>
        )}
        <button
          type="button"
          onClick={() => onWatchAd(bg.id, bg.name)}
          style={{
            background: "linear-gradient(135deg, #9B59B6, #6C3483)",
            border: "2px solid rgba(0,0,0,0.2)",
            borderRadius: 8,
            color: "white",
            fontFamily: "Fredoka One, Nunito, sans-serif",
            fontSize: 9,
            fontWeight: 900,
            padding: "5px 4px",
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
          }}
          data-ocid={`shop.bg.watch_ad_button.${index}`}
        >
          📺 ({adsWatched}/{adsRequired})
        </button>
      </div>
    )}
  </div>
);

export default ShopScreen;
