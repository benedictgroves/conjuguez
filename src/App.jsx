import { useState, useCallback, useRef, useEffect } from "react";

const PRONOUNS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

const VERBS = {
  parler: {
    présent: ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
    "passé composé": ["ai parlé", "as parlé", "a parlé", "avons parlé", "avez parlé", "ont parlé"],
    imparfait: ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
    futur: ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
  },
  manger: {
    présent: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
    "passé composé": ["ai mangé", "as mangé", "a mangé", "avons mangé", "avez mangé", "ont mangé"],
    imparfait: ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"],
    futur: ["mangerai", "mangeras", "mangera", "mangerons", "mangerez", "mangeront"],
  },
  aimer: {
    présent: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
    "passé composé": ["ai aimé", "as aimé", "a aimé", "avons aimé", "avez aimé", "ont aimé"],
    imparfait: ["aimais", "aimais", "aimait", "aimions", "aimiez", "aimaient"],
    futur: ["aimerai", "aimeras", "aimera", "aimerons", "aimerez", "aimeront"],
  },
  finir: {
    présent: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    "passé composé": ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"],
    imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
    futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
  },
  vendre: {
    présent: ["vends", "vends", "vend", "vendons", "vendez", "vendent"],
    "passé composé": ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"],
    imparfait: ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"],
    futur: ["vendrai", "vendras", "vendra", "vendrons", "vendrez", "vendront"],
  },
  être: {
    présent: ["suis", "es", "est", "sommes", "êtes", "sont"],
    "passé composé": ["ai été", "as été", "a été", "avons été", "avez été", "ont été"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
  },
  avoir: {
    présent: ["ai", "as", "a", "avons", "avez", "ont"],
    "passé composé": ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"],
    imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
  },
  aller: {
    présent: ["vais", "vas", "va", "allons", "allez", "vont"],
    "passé composé": ["suis allé(e)", "es allé(e)", "est allé(e)", "sommes allé(e)s", "êtes allé(e)s", "sont allé(e)s"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
  },
  faire: {
    présent: ["fais", "fais", "fait", "faisons", "faites", "font"],
    "passé composé": ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"],
    imparfait: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
    futur: ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
  },
  pouvoir: {
    présent: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    "passé composé": ["ai pu", "as pu", "a pu", "avons pu", "avez pu", "ont pu"],
    imparfait: ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
    futur: ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
  },
  vouloir: {
    présent: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    "passé composé": ["ai voulu", "as voulu", "a voulu", "avons voulu", "avez voulu", "ont voulu"],
    imparfait: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
    futur: ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
  },
  venir: {
    présent: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    "passé composé": ["suis venu(e)", "es venu(e)", "est venu(e)", "sommes venu(e)s", "êtes venu(e)s", "sont venu(e)s"],
    imparfait: ["venais", "venais", "venait", "venions", "veniez", "venaient"],
    futur: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
  },
  prendre: {
    présent: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    "passé composé": ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"],
    imparfait: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
    futur: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
  },
  savoir: {
    présent: ["sais", "sais", "sait", "savons", "savez", "savent"],
    "passé composé": ["ai su", "as su", "a su", "avons su", "avez su", "ont su"],
    imparfait: ["savais", "savais", "savait", "savions", "saviez", "savaient"],
    futur: ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"],
  },
  devoir: {
    présent: ["dois", "dois", "doit", "devons", "devez", "doivent"],
    "passé composé": ["ai dû", "as dû", "a dû", "avons dû", "avez dû", "ont dû"],
    imparfait: ["devais", "devais", "devait", "devions", "deviez", "devaient"],
    futur: ["devrai", "devras", "devra", "devrons", "devrez", "devront"],
  },
};

const TENSES = ["présent", "passé composé", "imparfait", "futur"];
const TENSE_COLORS = {
  présent: { bg: "#EEF2FF", border: "#6366F1", head: "#4338CA", tag: "indigo" },
  "passé composé": { bg: "#FEF3F2", border: "#EF4444", head: "#B91C1C", tag: "red" },
  imparfait: { bg: "#F0FDF4", border: "#22C55E", head: "#15803D", tag: "green" },
  futur: { bg: "#FFFBEB", border: "#F59E0B", head: "#B45309", tag: "amber" },
};

const VERB_GROUPS = {
  "-er": {
    verbs: ["parler", "manger", "aimer"],
    label: "-er verbs",
    guide: {
      présent: "Drop the -er, then add: -e, -es, -e, -ons, -ez, -ent. The je/tu/il and ils forms all sound the same — the endings are silent.",
      "passé composé": "Use avoir + past participle. The past participle is formed by replacing -er with -é (parler → parlé).",
      imparfait: "Take the nous form of the présent (e.g. parlons), drop -ons, then add: -ais, -ais, -ait, -ions, -iez, -aient.",
      futur: "Keep the full infinitive as the stem, then add: -ai, -as, -a, -ons, -ez, -ont. These endings look like the verb avoir!",
    },
  },
  "-ir": {
    verbs: ["finir"],
    label: "-ir verbs (regular)",
    guide: {
      présent: "Drop the -ir, then add: -is, -is, -it, -issons, -issez, -issent. Notice the -iss- that appears in the plural forms — it's the hallmark of regular -ir verbs.",
      "passé composé": "Use avoir + past participle. Replace -ir with -i (finir → fini).",
      imparfait: "Take the nous présent form (finissons), drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient. The -iss- carries through.",
      futur: "Keep the full infinitive as the stem, then add: -ai, -as, -a, -ons, -ez, -ont.",
    },
  },
  "-re": {
    verbs: ["vendre"],
    label: "-re verbs (regular)",
    guide: {
      présent: "Drop the -re, then add: -s, -s, (nothing), -ons, -ez, -ent. Notice il/elle has no ending at all — just the bare stem.",
      "passé composé": "Use avoir + past participle. Replace -re with -u (vendre → vendu).",
      imparfait: "Take the nous présent form (vendons), drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient. Same pattern as -er and -ir.",
      futur: "Drop the final -e from the infinitive to get the stem (vendr-), then add: -ai, -as, -a, -ons, -ez, -ont.",
    },
  },
  irregular: {
    verbs: ["être", "avoir", "aller", "faire", "pouvoir", "vouloir", "venir", "prendre", "savoir", "devoir"],
    label: "Irregular",
    guide: {
      présent: "Each verb has its own pattern — no shortcut here. Focus on the most common ones first: être, avoir, aller, faire. Many have a stem change between singular and plural (e.g. venir: viens/venons).",
      "passé composé": "Most use avoir, but aller and venir use être (and the participle agrees with the subject). Participles vary: été, eu, allé, fait, pu, voulu, venu, pris, su, dû.",
      imparfait: "Good news — even irregular verbs follow the regular imparfait rule! Take the nous présent form, drop -ons, add the standard endings. The only exception is être (ét-).",
      futur: "Irregular verbs often have irregular future stems: ser- (être), aur- (avoir), ir- (aller), fer- (faire), pourr- (pouvoir), voudr- (vouloir), viendr- (venir), saur- (savoir), devr- (devoir). But the endings are always regular.",
    },
  },
};

function getVerbGroup(v) {
  for (const [key, group] of Object.entries(VERB_GROUPS)) {
    if (group.verbs.includes(v)) return key;
  }
  return "irregular";
}

const GROUP_COLORS = {
  "-er": { bg: "#FFF7ED", border: "#EA580C", head: "#C2410C" },
  "-ir": { bg: "#F0F9FF", border: "#0284C7", head: "#0369A1" },
  "-re": { bg: "#FDF4FF", border: "#A855F7", head: "#7E22CE" },
  irregular: { bg: "#FFF1F2", border: "#E11D48", head: "#BE123C" },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChips(verb) {
  const data = VERBS[verb];
  let allChips = [];
  TENSES.forEach((tense) => {
    PRONOUNS.forEach((pronoun, i) => {
      allChips.push({
        id: `${tense}--${i}`,
        text: data[tense][i],
        tense,
        pronounIdx: i,
      });
    });
  });
  return shuffle(allChips);
}

function DropSlot({ tense, pronounIdx, placed, onDrop, onRemove, checked, correct, dragOver, onDragOver, onDragLeave }) {
  const pronoun = PRONOUNS[pronounIdx];
  const colors = TENSE_COLORS[tense];
  const isCorrect = checked && correct;
  const isWrong = checked && !correct && placed;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDragLeave();
        try { onDrop(JSON.parse(e.dataTransfer.getData("text/plain"))); } catch {}
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 0",
        borderBottom: pronounIdx < 5 ? "1px solid #f0f0f0" : "none",
      }}
    >
      <span style={{
        width: 72,
        fontSize: 13,
        color: "#64748B",
        fontStyle: "italic",
        textAlign: "right",
        flexShrink: 0,
      }}>
        {pronoun}
      </span>
      <div
        style={{
          flex: 1,
          minHeight: 34,
          borderRadius: 6,
          border: dragOver
            ? `2px dashed ${colors.border}`
            : placed
              ? isCorrect
                ? "2px solid #22C55E"
                : isWrong
                  ? "2px solid #EF4444"
                  : `1.5px solid ${colors.border}88`
              : "1.5px dashed #CBD5E1",
          background: placed
            ? isCorrect ? "#F0FDF4" : isWrong ? "#FEF2F2" : "#fff"
            : dragOver ? `${colors.bg}` : "#FAFBFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: placed && !checked ? "pointer" : "default",
          transition: "all 0.15s ease",
          position: "relative",
        }}
        onClick={() => { if (placed && !checked) onRemove(); }}
        title={placed && !checked ? "Click to remove" : ""}
      >
        {placed ? (
          <span style={{
            fontSize: 14,
            fontWeight: 500,
            color: isCorrect ? "#15803D" : isWrong ? "#B91C1C" : "#1E293B",
            padding: "4px 8px",
          }}>
            {placed.text}
            {isWrong && (
              <span style={{ fontSize: 11, color: "#EF4444", marginLeft: 6 }}>✕</span>
            )}
            {isCorrect && (
              <span style={{ fontSize: 11, color: "#22C55E", marginLeft: 6 }}>✓</span>
            )}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#CBD5E1" }}>—</span>
        )}
      </div>
    </div>
  );
}

function Quadrant({ tense, verb, placements, onDrop, onRemove, checked, corrections }) {
  const colors = TENSE_COLORS[tense];
  const [dragOverSlot, setDragOverSlot] = useState(null);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: `1.5px solid ${colors.border}33`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        background: colors.bg,
        borderBottom: `1.5px solid ${colors.border}33`,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: colors.head,
          background: `${colors.border}18`,
          padding: "2px 8px",
          borderRadius: 4,
        }}>
          {tense}
        </span>
      </div>
      <div style={{ padding: "6px 14px 10px" }}>
        {PRONOUNS.map((_, i) => (
          <DropSlot
            key={i}
            tense={tense}
            pronounIdx={i}
            placed={placements[`${tense}--${i}`] || null}
            onDrop={(chip) => onDrop(tense, i, chip)}
            onRemove={() => onRemove(tense, i)}
            checked={checked}
            correct={corrections ? corrections[`${tense}--${i}`] : false}
            dragOver={dragOverSlot === i}
            onDragOver={() => setDragOverSlot(i)}
            onDragLeave={() => setDragOverSlot(null)}
          />
        ))}
      </div>
      {checked && corrections && (
        <div style={{ padding: "4px 14px 10px" }}>
          {PRONOUNS.map((p, i) => {
            const key = `${tense}--${i}`;
            if (corrections[key]) return null;
            return (
              <div key={i} style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                {p} → <strong style={{ color: colors.head }}>{VERBS[verb][tense][i]}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FrenchVerbApp() {
  const verbNames = Object.keys(VERBS).sort((a, b) => a.localeCompare(b, 'fr'));
  const [verb, setVerb] = useState(() => verbNames[Math.floor(Math.random() * verbNames.length)]);
  const [chips, setChips] = useState(() => makeChips(verb));
  const [placements, setPlacements] = useState({});
  const [checked, setChecked] = useState(false);
  const [corrections, setCorrections] = useState(null);
  const [score, setScore] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [touchDrag, setTouchDrag] = useState(null);
  const touchChipRef = useRef(null);
  const slotsRef = useRef({});
  const [groupFilter, setGroupFilter] = useState(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [instantMode, setInstantMode] = useState(true);

  const filteredVerbNames = groupFilter
    ? verbNames.filter((v) => VERB_GROUPS[groupFilter].verbs.includes(v))
    : verbNames;

  const availableChips = chips.filter(
    (c) => !Object.values(placements).find((p) => p && p.id === c.id)
  );

  const handleDrop = useCallback((tense, pronounIdx, chip) => {
    if (checked) return;
    setPlacements((prev) => {
      const next = { ...prev };
      // Remove chip from any other slot
      Object.keys(next).forEach((k) => {
        if (next[k] && next[k].id === chip.id) next[k] = null;
      });
      // If slot is occupied, free the old chip
      const key = `${tense}--${pronounIdx}`;
      next[key] = chip;
      return next;
    });
  }, [checked]);

  const handleRemove = useCallback((tense, pronounIdx) => {
    if (checked) return;
    setPlacements((prev) => ({ ...prev, [`${tense}--${pronounIdx}`]: null }));
  }, [checked]);

  const handleCheck = () => {
    const data = VERBS[verb];
    let correct = 0;
    let total = 24;
    const corr = {};
    TENSES.forEach((tense) => {
      PRONOUNS.forEach((_, i) => {
        const key = `${tense}--${i}`;
        const placed = placements[key];
        const isCorrect = placed && placed.text === data[tense][i];
        corr[key] = !!isCorrect;
        if (isCorrect) correct++;
      });
    });
    setCorrections(corr);
    setScore({ correct, total });
    setChecked(true);
  };

  const handleNewVerb = (v) => {
    const pool = groupFilter
      ? verbNames.filter((vn) => VERB_GROUPS[groupFilter].verbs.includes(vn))
      : verbNames;
    const chosen = v || pool[Math.floor(Math.random() * pool.length)];
    setVerb(chosen);
    setChips(makeChips(chosen));
    setPlacements({});
    setChecked(false);
    setCorrections(null);
    setScore(null);
    setTenseFilter(null);
  };

  const handleGroupChange = (g) => {
    const newGroup = groupFilter === g ? null : g;
    setGroupFilter(newGroup);
    setGuideOpen(false);
    // Pick a verb from the new group
    if (newGroup) {
      const pool = VERB_GROUPS[newGroup].verbs;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      handleNewVerbDirect(chosen);
    }
  };

  const handleNewVerbDirect = (v) => {
    setVerb(v);
    setChips(makeChips(v));
    setPlacements({});
    setChecked(false);
    setCorrections(null);
    setScore(null);
    setTenseFilter(null);
  };

  const filledCount = Object.values(placements).filter(Boolean).length;

  // Touch handlers for mobile drag
  const handleTouchStart = (e, chip) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchDrag({ chip, x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = useCallback((e) => {
    if (!touchDrag) return;
    e.preventDefault();
    const touch = e.touches[0];
    setTouchDrag(prev => prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null);
  }, [touchDrag]);

  const handleTouchEnd = useCallback((e) => {
    if (!touchDrag) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    // Find the closest drop slot
    if (el) {
      const slot = el.closest('[data-slot]');
      if (slot) {
        const [tense, idx] = slot.dataset.slot.split('|');
        handleDrop(tense, parseInt(idx), touchDrag.chip);
      }
    }
    setTouchDrag(null);
  }, [touchDrag, handleDrop]);

  useEffect(() => {
    if (touchDrag) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchDrag, handleTouchMove, handleTouchEnd]);

  // Mobile-friendly: tap to select, then tap slot
  const [selectedChip, setSelectedChip] = useState(null);
  const [tenseFilter, setTenseFilter] = useState(null);

  const handleChipTap = (chip) => {
    if (checked) return;
    setSelectedChip(prev => prev?.id === chip.id ? null : chip);
  };

  const handleSlotTap = (tense, pronounIdx) => {
    if (checked || !selectedChip) return;
    handleDrop(tense, pronounIdx, selectedChip);
    setSelectedChip(null);
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      maxWidth: "100%",
      margin: "0 auto",
      padding: "24px 16px",
      minHeight: "100vh",
      background: "#1B2A4A",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#E8ECF4",
          margin: 0,
          letterSpacing: "-0.02em",
        }}>
          Conjuguez !
        </h1>
        <p style={{ color: "#8B9CC0", fontSize: 13, margin: "6px 0 0" }}>
          Drag each conjugation into the correct slot — or tap to select, then tap a slot
        </p>
        <button
          onClick={() => setInstantMode(!instantMode)}
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: instantMode ? "#15803D" : "#8B9CC0",
            background: instantMode ? "#F0FDF4" : "rgba(255,255,255,0.06)",
            border: `1.5px solid ${instantMode ? "#22C55E" : "#3D4F6F"}`,
            borderRadius: 20,
            padding: "6px 16px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{
            width: 32,
            height: 18,
            borderRadius: 9,
            background: instantMode ? "#22C55E" : "#CBD5E1",
            position: "relative",
            display: "inline-block",
            transition: "background 0.2s",
          }}>
            <span style={{
              position: "absolute",
              top: 2,
              left: instantMode ? 16 : 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }} />
          </span>
          Instant feedback
        </button>
      </div>

      {/* Verb group filter */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        marginBottom: 16,
        flexWrap: "wrap",
      }}>
        {Object.entries(VERB_GROUPS).map(([key, group]) => {
          const gc = GROUP_COLORS[key];
          const active = groupFilter === key;
          return (
            <button
              key={key}
              onClick={() => handleGroupChange(key)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 8,
                border: `1.5px solid ${active ? gc.border : "#3D4F6F"}`,
                background: active ? gc.bg : "rgba(255,255,255,0.06)",
                color: active ? gc.head : "#8B9CC0",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Pattern guide */}
      {groupFilter && (
        <div style={{
          background: "#fff",
          borderRadius: 12,
          border: `1.5px solid ${GROUP_COLORS[groupFilter].border}33`,
          marginBottom: 16,
          overflow: "hidden",
        }}>
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: GROUP_COLORS[groupFilter].bg,
              border: "none",
              cursor: "pointer",
              borderBottom: guideOpen ? `1px solid ${GROUP_COLORS[groupFilter].border}22` : "none",
            }}
          >
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: GROUP_COLORS[groupFilter].head,
            }}>
              How do {VERB_GROUPS[groupFilter].label} work?
            </span>
            <span style={{
              fontSize: 18,
              color: GROUP_COLORS[groupFilter].head,
              transform: guideOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              ▾
            </span>
          </button>
          {guideOpen && (
            <div style={{ padding: "12px 16px 16px" }}>
              {TENSES.map((tense) => {
                const tc = TENSE_COLORS[tense];
                return (
                  <div key={tense} style={{ marginBottom: 12 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: tc.head,
                      background: tc.bg,
                      padding: "2px 8px",
                      borderRadius: 4,
                      display: "inline-block",
                      marginBottom: 4,
                    }}>
                      {tense}
                    </span>
                    <p style={{
                      fontSize: 13,
                      color: "#475569",
                      lineHeight: 1.55,
                      margin: "4px 0 0",
                    }}>
                      {VERB_GROUPS[groupFilter].guide[tense]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Verb selector */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20,
        flexWrap: "wrap",
      }}>
        <select
          value={verb}
          onChange={(e) => handleNewVerb(e.target.value)}
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#4338CA",
            background: "#EEF2FF",
            border: "1.5px solid #C7D2FE",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            appearance: "auto",
          }}
        >
          {filteredVerbNames.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <button
          onClick={() => handleNewVerb()}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#6366F1",
            background: "transparent",
            border: "1.5px solid #C7D2FE",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Random verb
        </button>
        {(() => {
          const g = getVerbGroup(verb);
          const gc = GROUP_COLORS[g];
          return (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: gc.head,
              background: gc.bg,
              border: `1px solid ${gc.border}44`,
              borderRadius: 5,
              padding: "4px 10px",
            }}>
              {VERB_GROUPS[g].label}
            </span>
          );
        })()}
      </div>

      {/* Four quadrants */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 16,
        marginBottom: 20,
      }}>
        {TENSES.map((tense) => (
          <div key={tense}>
            <QuadrantWithSlotTap
              tense={tense}
              verb={verb}
              placements={placements}
              onDrop={handleDrop}
              onRemove={handleRemove}
              checked={checked}
              corrections={corrections}
              selectedChip={selectedChip}
              onSlotTap={handleSlotTap}
              instantMode={instantMode}
            />
          </div>
        ))}
      </div>

      {/* Chip tray */}
      <div style={{
        background: "#152038",
        borderRadius: 12,
        border: "1.5px solid #2D3F5F",
        padding: "14px 16px",
        marginBottom: 16,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#7B8DB0",
          }}>
            Conjugations ({availableChips.length} remaining)
          </span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <button
              onClick={() => setTenseFilter(null)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 5,
                border: "1.5px solid #2D3F5F",
                background: tenseFilter === null ? "#1E293B" : "transparent",
                color: tenseFilter === null ? "#fff" : "#7B8DB0",
                cursor: "pointer",
              }}
            >
              All
            </button>
            {TENSES.map((t) => {
              const c = TENSE_COLORS[t];
              const active = tenseFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTenseFilter(active ? null : t)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 5,
                    border: `1.5px solid ${active ? c.border : "#2D3F5F"}`,
                    background: active ? c.bg : "transparent",
                    color: active ? c.head : "#7B8DB0",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 36 }}>
          {availableChips.length === 0 && !checked && (
            <span style={{ fontSize: 13, color: "#7B8DB0", fontStyle: "italic" }}>
              All placed — check your answers below
            </span>
          )}
          {availableChips.filter(c => !tenseFilter || c.tense === tenseFilter).length === 0 && availableChips.length > 0 && (
            <span style={{ fontSize: 13, color: "#7B8DB0", fontStyle: "italic" }}>
              No remaining chips for this tense
            </span>
          )}
          {availableChips.filter(c => !tenseFilter || c.tense === tenseFilter).map((chip) => {
            const colors = TENSE_COLORS[chip.tense];
            const isSelected = selectedChip?.id === chip.id;
            return (
              <div
                key={chip.id}
                draggable={!checked}
                onDragStart={(e) => {
                  setDragging(chip.id);
                  e.dataTransfer.setData("text/plain", JSON.stringify(chip));
                }}
                onDragEnd={() => setDragging(null)}
                onClick={() => handleChipTap(chip)}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: 6,
                  background: isSelected ? colors.border : "rgba(255,255,255,0.9)",
                  color: isSelected ? "#fff" : "#1E293B",
                  border: `1.5px solid ${isSelected ? colors.border : "rgba(255,255,255,0.2)"}`,
                  cursor: checked ? "default" : "grab",
                  opacity: dragging === chip.id ? 0.4 : 1,
                  transition: "all 0.12s ease",
                  userSelect: "none",
                  boxShadow: isSelected ? `0 0 0 3px ${colors.border}33` : "none",
                }}
              >
                {chip.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
        {filledCount > 0 && instantMode && (() => {
          const data = VERBS[verb];
          let correct = 0;
          TENSES.forEach((tense) => {
            PRONOUNS.forEach((_, i) => {
              const p = placements[`${tense}--${i}`];
              if (p && p.text === data[tense][i]) correct++;
            });
          });
          return (
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: correct === filledCount ? "#15803D" : correct >= filledCount * 0.75 ? "#B45309" : "#B91C1C",
            }}>
              {correct}/{filledCount}
              {filledCount === 24 && correct === 24 && " 🎉"}
            </div>
          );
        })()}
        <button
          onClick={() => handleNewVerb()}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            background: "#4338CA",
            border: "none",
            borderRadius: 10,
            padding: "12px 32px",
            cursor: "pointer",
          }}
        >
          Next verb
        </button>
      </div>
    </div>
  );
}

// Quadrant variant that supports tap-to-place
function QuadrantWithSlotTap({ tense, verb, placements, onDrop, onRemove, checked, corrections, selectedChip, onSlotTap, instantMode }) {
  const colors = TENSE_COLORS[tense];
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const data = VERBS[verb];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: `1.5px solid ${colors.border}33`,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        background: colors.bg,
        borderBottom: `1.5px solid ${colors.border}33`,
        padding: "10px 16px",
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: colors.head,
          background: `${colors.border}18`,
          padding: "2px 8px",
          borderRadius: 4,
        }}>
          {tense}
        </span>
      </div>
      <div style={{ padding: "6px 14px 10px" }}>
        {PRONOUNS.map((pronoun, i) => {
          const key = `${tense}--${i}`;
          const placed = placements[key] || null;

          // Instant mode: check correctness as soon as placed
          const instantCorrect = instantMode && placed && placed.text === data[tense][i];
          const instantWrong = instantMode && placed && placed.text !== data[tense][i];

          // Checked mode (end-of-round)
          const checkedCorrect = checked && corrections && corrections[key];
          const checkedWrong = checked && corrections && !corrections[key] && placed;

          const isCorrect = instantCorrect || checkedCorrect;
          const isWrong = instantWrong || checkedWrong;

          const isDragOver = dragOverSlot === i;
          const canTap = !checked && selectedChip && !placed;

          return (
            <div
              key={i}
              data-slot={`${tense}|${i}`}
              onClick={() => {
                if (canTap) onSlotTap(tense, i);
                else if (placed && !checked) onRemove(tense, i);
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOverSlot(i); }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverSlot(null);
                try { onDrop(tense, i, JSON.parse(e.dataTransfer.getData("text/plain"))); } catch {}
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                borderBottom: i < 5 ? "1px solid #f0f0f0" : "none",
                cursor: canTap ? "pointer" : placed && !checked ? "pointer" : "default",
              }}
            >
              <span style={{
                width: 72,
                fontSize: 13,
                color: "#64748B",
                fontStyle: "italic",
                textAlign: "right",
                flexShrink: 0,
              }}>
                {pronoun}
              </span>
              <div style={{
                flex: 1,
                minHeight: 34,
                borderRadius: 6,
                border: isDragOver
                  ? `2px dashed ${colors.border}`
                  : canTap
                    ? `2px dashed ${colors.border}88`
                    : placed
                      ? isCorrect
                        ? "2px solid #22C55E"
                        : isWrong
                          ? "2px solid #EF4444"
                          : `1.5px solid ${colors.border}88`
                      : "1.5px dashed #CBD5E1",
                background: placed
                  ? isCorrect ? "#F0FDF4" : isWrong ? "#FEF2F2" : "#fff"
                  : isDragOver || canTap ? colors.bg : "#FAFBFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              title={placed && !checked ? "Click to remove" : canTap ? "Tap to place" : ""}
              >
                {placed ? (
                  <span style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: isCorrect ? "#15803D" : isWrong ? "#B91C1C" : "#1E293B",
                    padding: "4px 8px",
                  }}>
                    {placed.text}
                    {isWrong && <span style={{ fontSize: 11, color: "#EF4444", marginLeft: 6 }}>✕</span>}
                    {isCorrect && <span style={{ fontSize: 11, color: "#22C55E", marginLeft: 6 }}>✓</span>}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: "#CBD5E1" }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {checked && corrections && (
        <div style={{ padding: "4px 14px 10px" }}>
          {PRONOUNS.map((p, i) => {
            const key = `${tense}--${i}`;
            if (corrections[key]) return null;
            return (
              <div key={i} style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                {p} → <strong style={{ color: colors.head }}>{VERBS[verb][tense][i]}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
