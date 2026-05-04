(function () {
  const reference = {
    revenue: 38288.3,
    expense: 39822.4,
    result: -1534.1,
    previousCash: 15000,
  };

  const defaultState = {
    members: [
      {
        key: "minibad",
        label: "Minibad / poussins",
        count: 13,
        fee: 105,
        federal: 13.73,
        territorial: 9.88,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "young1",
        label: "Jeunes 1 entraînement",
        count: 36,
        fee: 115,
        federal: 25.97,
        territorial: 29.75,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "young2",
        label: "Jeunes 2 entraînements",
        count: 19,
        fee: 140,
        federal: 25.97,
        territorial: 29.75,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "adultLeisure",
        label: "Adultes loisir",
        count: 86,
        fee: 105,
        federal: 31.57,
        territorial: 29.75,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "adultCompetition",
        label: "Adultes compétition",
        count: 31,
        fee: 150,
        federal: 31.57,
        territorial: 29.75,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "adultCompetitionTraining",
        label: "Adultes compétition + entraînement",
        count: 8,
        fee: 180,
        federal: 31.57,
        territorial: 29.75,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
      {
        key: "external",
        label: "Joueurs externes",
        count: 13,
        fee: 60,
        federal: 0,
        territorial: 0,
        tournamentsIncluded: 0,
        tournamentFee: 0,
      },
    ],
    shuttle: {
      adultBoxesPerPlayer: 3,
      subsidizedBoxesPerAdult: 5,
      costPerBox: 35,
      subsidizedSalePrice: 20,
      regularSalePrice: 35,
      freePlaySeasonStart: "2025-09-01",
      freePlaySeasonEnd: "2026-06-30",
      freePlayBoxesPerWeek: 4,
      freePlayBoxPrice: 35,
      youthTrainingBoxesPerWeek: 5,
      youthTrainingBoxPrice: 35,
    },
    training: {
      coachMonthlyCost: 1760,
      months: 10,
      coachingAndStages: 1830,
      trainingCourses: 0,
      stringsPerAdultCompetitor: 4,
      stringUnitCost: 4,
    },
    other: {
      cityGrant: 2700,
      clubLife: 2171.5,
      bankFees: 500,
      miscExpense: 0,
      cashStart: 15000,
    },
    events: [
      {
        name: "Double à Voreppe",
        detail: "Inscriptions, JA, lots, snack",
        expense: 3620.98,
        revenue: 6415.65,
        registrationRevenue: 4115,
        playerCount: 196,
        priceIncrease: 0,
      },
      {
        name: "TDJ",
        detail: "Adhésion, JA, snack",
        expense: 267.65,
        revenue: 1178.9,
        registrationRevenue: 758,
        playerCount: 42,
        priceIncrease: 0,
      },
      {
        name: "TRV juin",
        detail: "Inscriptions, JA, lots, snack",
        expense: 2275.44,
        revenue: 6010.2,
        registrationRevenue: 3423,
        playerCount: 163,
        priceIncrease: 0,
      },
      {
        name: "BADASS",
        detail: "Inscriptions, JA, snack",
        expense: 575.79,
        revenue: 1081.37,
        registrationRevenue: 600,
        playerCount: 29,
        priceIncrease: 0,
      },
      {
        name: "Badbeccue",
        detail: "Inscriptions, snack",
        expense: 269.75,
        revenue: 1029.5,
        registrationRevenue: 960,
        playerCount: 46,
        priceIncrease: 0,
      },
      {
        name: "Chartreux",
        detail: "JA, partage recettes, snack",
        expense: 1372.19,
        revenue: 2020.6,
        registrationRevenue: 0,
        playerCount: 0,
        priceIncrease: 0,
      },
    ],
  };

  const storageKey = "bcv38-financial-simulator-v4";
  const schoolHolidayPeriods = [
    { label: "Toussaint", start: "2025-10-18", end: "2025-11-03" },
    { label: "Noël", start: "2025-12-20", end: "2026-01-05" },
    { label: "Hiver zone A", start: "2026-02-07", end: "2026-02-23" },
    { label: "Printemps zone A", start: "2026-04-04", end: "2026-04-20" },
  ];
  let state = loadState();

  const euroFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const preciseEuroFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const elements = {
    membersTable: document.querySelector("#membersTable tbody"),
    eventsTable: document.querySelector("#eventsTable tbody"),
    categoryTable: document.querySelector("#categoryTable tbody"),
    shuttleControls: document.querySelector("#shuttleControls"),
    trainingControls: document.querySelector("#trainingControls"),
    otherControls: document.querySelector("#otherControls"),
    saveStatus: document.querySelector("#saveStatus"),
  };

  const controlConfig = {
    shuttle: [
      ["adultBoxesPerPlayer", "Boîtes / adulte compétition", "boîtes", "number", "mixed"],
      ["subsidizedBoxesPerAdult", "Quota à 20 € / adulte compétition", "boîtes", "number", "mixed"],
      ["costPerBox", "Prix achat boîte", "€", "number", "expense"],
      ["subsidizedSalePrice", "Prix vente subventionné", "€", "number", "revenue"],
      ["regularSalePrice", "Prix vente après quota", "€", "number", "revenue"],
      ["freePlaySeasonStart", "Début saison jeux libre", "zone A Grenoble", "date", "neutral"],
      ["freePlaySeasonEnd", "Fin saison jeux libre", "hors été", "date", "neutral"],
      ["freePlayBoxesPerWeek", "Boîtes / semaine jeux libre", "boîtes", "number", "expense"],
      ["freePlayBoxPrice", "Prix boîte jeux libre", "€", "number", "expense"],
      ["youthTrainingBoxesPerWeek", "Boîtes / semaine entraînements jeunes", "boîtes", "number", "expense"],
      ["youthTrainingBoxPrice", "Prix boîte entraînements jeunes", "€", "number", "expense"],
    ],
    training: [
      ["coachMonthlyCost", "Entraîneurs / mois", "€", "number", "expense"],
      ["months", "Nombre de mois", "mois", "number", "expense"],
      ["coachingAndStages", "Recettes stages", "€", "number", "revenue"],
      ["trainingCourses", "Formations MODEF / GEO", "€", "number", "expense"],
      ["stringsPerAdultCompetitor", "Cordages / adulte compétition", "cordages", "number", "expense"],
      ["stringUnitCost", "Prix coût cordage", "€", "number", "expense"],
    ],
    other: [
      ["cityGrant", "Subvention mairie / OMS", "€", "number", "revenue"],
      ["clubLife", "Vie du club", "€", "number", "expense"],
      ["bankFees", "Frais bancaires", "€", "number", "expense"],
      ["miscExpense", "Autres dépenses", "€", "number", "expense"],
      ["cashStart", "Solde bancaire initial", "€", "number", "neutral"],
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return clone(defaultState);
      return mergeState(clone(defaultState), JSON.parse(raw));
    } catch (error) {
      return clone(defaultState);
    }
  }

  function mergeState(base, saved) {
    const merged = { ...base, ...saved };
    merged.shuttle = { ...base.shuttle, ...(saved.shuttle || {}) };
    merged.training = { ...base.training, ...(saved.training || {}) };
    merged.other = { ...base.other, ...(saved.other || {}) };
    merged.members = Array.isArray(saved.members) ? saved.members : base.members;
    merged.events = Array.isArray(saved.events)
      ? saved.events.map((event, index) => normalizeEvent(event, base.events[index], base.events))
      : base.events;
    return merged;
  }

  function normalizeEvent(event, fallback, fallbackEvents) {
    const namedFallback = fallbackEvents.find((candidate) => candidate.name === event.name);
    const defaults = namedFallback || fallback || {};
    const registrationRevenue = event.registrationRevenue ?? defaults.registrationRevenue ?? 0;
    const playerCount = event.playerCount ?? defaults.playerCount ?? 0;
    return {
      registrationRevenue,
      playerCount,
      priceIncrease: defaults.priceIncrease ?? 0,
      ...event,
    };
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    elements.saveStatus.textContent = "Sauvegardé";
    window.clearTimeout(saveState.timer);
    saveState.timer = window.setTimeout(() => {
      elements.saveStatus.textContent = "Sauvegarde locale active";
    }, 1300);
  }

  function asNumber(value) {
    const parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function money(value, precise = false) {
    return (precise ? preciseEuroFormatter : euroFormatter).format(value);
  }

  function signed(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${money(value)}`;
  }

  function hasAdultCompetitionBenefits(member) {
    return member.key === "adultCompetition" || member.key === "adultCompetitionTraining";
  }

  function referenceNote(section, field, index = "") {
    return `<small class="input-reference" data-section="${section}" data-index="${index}" data-field="${field}"></small>`;
  }

  function getReferenceValue(section, field, index) {
    if (section === "members") {
      return defaultState.members[Number(index)]?.[field] ?? null;
    }
    if (section === "events") {
      return defaultState.events[Number(index)]?.[field] ?? null;
    }
    return defaultState[section]?.[field] ?? null;
  }

  function isMoneyField(field) {
    return /fee|federal|territorial|cost|price|revenue|expense|grant|life|fees|cash|courses|stages|increase/i.test(
      field
    );
  }

  function formatReferenceValue(field, value) {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const numeric = asNumber(value);
    if (isMoneyField(field)) return money(numeric, Math.abs(numeric % 1) > 0);
    return String(value);
  }

  function formatReferenceDelta(field, current, referenceValue) {
    if (referenceValue === null || referenceValue === undefined || referenceValue === "") return "";
    if (typeof referenceValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(referenceValue)) {
      return current === referenceValue ? "" : "modifié";
    }
    const delta = asNumber(current) - asNumber(referenceValue);
    if (Math.abs(delta) < 0.0001) return "";
    const prefix = delta > 0 ? "+" : "";
    return isMoneyField(field) ? `${prefix}${money(delta, Math.abs(delta % 1) > 0)}` : `${prefix}${delta}`;
  }

  function updateReferenceNotes() {
    document.querySelectorAll(".input-reference").forEach((note) => {
      const { section, field, index } = note.dataset;
      const input = note.parentElement.querySelector(`[data-section="${section}"][data-field="${field}"]`);
      const referenceValue = getReferenceValue(section, field, index);
      if (!input || referenceValue === null) {
        note.textContent = "";
        note.classList.remove("is-changed");
        return;
      }
      const delta = formatReferenceDelta(field, input.value, referenceValue);
      note.textContent = `Réf. ${formatReferenceValue(field, referenceValue)}${delta ? ` · Écart ${delta}` : ""}`;
      note.classList.toggle("is-changed", Boolean(delta));
    });
  }

  function renderMembers() {
    elements.membersTable.innerHTML = "";
    state.members.forEach((member, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${member.label}</td>
        ${numberCell("count", member.count, index, 1, "neutral")}
        ${numberCell("fee", member.fee, index, 0.5, "revenue")}
        ${numberCell("federal", member.federal, index, 0.01, "expense")}
        ${numberCell("territorial", member.territorial, index, 0.01, "expense")}
      `;
      elements.membersTable.appendChild(row);
    });
  }

  function numberCell(field, value, index, step, flow) {
    return `<td class="flow-cell flow-${flow}"><input type="number" min="0" step="${step}" value="${value}" data-section="members" data-index="${index}" data-field="${field}">${referenceNote("members", field, index)}</td>`;
  }

  function renderControls(section, container) {
    container.innerHTML = "";
    controlConfig[section].forEach(([field, label, suffix, type = "number", flow = "neutral"]) => {
      const wrapper = document.createElement("label");
      wrapper.className = `control flow-card flow-${flow}`;
      wrapper.innerHTML = `
        <span>${label}</span>
        <input type="${type}" ${type === "number" ? 'step="0.01"' : ""} value="${state[section][field]}" data-section="${section}" data-field="${field}">
        ${referenceNote(section, field)}
        <small>${suffix}</small>
      `;
      container.appendChild(wrapper);
    });
  }

  function renderEvents() {
    elements.eventsTable.innerHTML = "";
    state.events.forEach((event, index) => {
      const projectedRevenue = getProjectedEventRevenue(event);
      const net = projectedRevenue - event.expense;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input value="${escapeAttribute(event.name)}" data-section="events" data-index="${index}" data-field="name"></td>
        <td><input value="${escapeAttribute(event.detail)}" data-section="events" data-index="${index}" data-field="detail"></td>
        <td class="flow-cell flow-neutral"><input type="number" min="0" step="1" value="${event.playerCount}" data-section="events" data-index="${index}" data-field="playerCount">${referenceNote("events", "playerCount", index)}</td>
        <td class="flow-cell flow-revenue"><input type="number" min="0" step="0.5" value="${event.priceIncrease}" data-section="events" data-index="${index}" data-field="priceIncrease">${referenceNote("events", "priceIncrease", index)}</td>
        <td class="flow-cell flow-expense"><input type="number" min="0" step="0.01" value="${event.expense}" data-section="events" data-index="${index}" data-field="expense">${referenceNote("events", "expense", index)}</td>
        <td class="flow-cell flow-revenue"><input type="number" min="0" step="0.01" value="${event.revenue}" data-section="events" data-index="${index}" data-field="revenue">${referenceNote("events", "revenue", index)}</td>
        <td class="simulated-revenue">${money(projectedRevenue)}</td>
        <td><strong data-role="event-net" class="${net >= 0 ? "positive" : "negative"}">${money(net)}</strong></td>
        <td><button class="remove-button" type="button" data-remove-event="${index}" title="Supprimer" aria-label="Supprimer">×</button></td>
      `;
      elements.eventsTable.appendChild(row);
    });
  }

  function getProjectedEventRevenue(event) {
    return event.revenue + event.playerCount * event.priceIncrease;
  }

  function escapeAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function parseDay(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (!match) return null;
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  }

  function isInHoliday(date) {
    return schoolHolidayPeriods.some((period) => {
      const start = parseDay(period.start);
      const end = parseDay(period.end);
      return start && end && date >= start && date < end;
    });
  }

  function countActiveWeeks(startValue, endValue) {
    const start = parseDay(startValue);
    const end = parseDay(endValue);
    if (!start || !end || start > end) return 0;

    let cursor = new Date(start);
    while (cursor.getUTCDay() !== 1) {
      cursor = addDays(cursor, 1);
    }

    let weeks = 0;
    while (cursor <= end) {
      if (!isInHoliday(cursor)) weeks += 1;
      cursor = addDays(cursor, 7);
    }
    return weeks;
  }

  function calculate() {
    const totalMembers = state.members.reduce((sum, member) => sum + member.count, 0);
    const youthMembers = state.members
      .filter((member) => member.key === "minibad" || member.key.startsWith("young"))
      .reduce((sum, member) => sum + member.count, 0);
    const adultCompetitorMembers = state.members
      .filter(hasAdultCompetitionBenefits)
      .reduce((sum, member) => sum + member.count, 0);
    const freePlayBeneficiaries = state.members
      .filter((member) => hasAdultCompetitionBenefits(member) || member.key === "external")
      .reduce((sum, member) => sum + member.count, 0);

    const membershipRevenue = state.members.reduce((sum, member) => sum + member.count * member.fee, 0);
    const licenseExpense = state.members.reduce(
      (sum, member) => sum + member.count * (member.federal + member.territorial),
      0
    );
    const adultBoxes = adultCompetitorMembers * state.shuttle.adultBoxesPerPlayer;
    const subsidizedBoxes = Math.min(adultBoxes, adultCompetitorMembers * state.shuttle.subsidizedBoxesPerAdult);
    const regularBoxes = Math.max(0, adultBoxes - subsidizedBoxes);
    const totalBoxes = adultBoxes;
    const shuttleRevenue =
      subsidizedBoxes * state.shuttle.subsidizedSalePrice + regularBoxes * state.shuttle.regularSalePrice;
    const memberShuttleExpense = totalBoxes * state.shuttle.costPerBox;
    const freePlayWeeks = countActiveWeeks(state.shuttle.freePlaySeasonStart, state.shuttle.freePlaySeasonEnd);
    const freePlayBoxes = freePlayWeeks * state.shuttle.freePlayBoxesPerWeek;
    const freePlayExpense = freePlayBoxes * state.shuttle.freePlayBoxPrice;
    const youthTrainingBoxes = freePlayWeeks * state.shuttle.youthTrainingBoxesPerWeek;
    const youthTrainingExpense = youthTrainingBoxes * state.shuttle.youthTrainingBoxPrice;
    const shuttleExpense = memberShuttleExpense + freePlayExpense + youthTrainingExpense;
    const shuttleSubsidy = shuttleExpense - shuttleRevenue;

    const eventRevenue = state.events.reduce((sum, event) => sum + getProjectedEventRevenue(event), 0);
    const eventExpense = state.events.reduce((sum, event) => sum + event.expense, 0);

    const trainingExpense =
      state.training.coachMonthlyCost * state.training.months +
      state.training.trainingCourses;
    const stringingExpense =
      adultCompetitorMembers * state.training.stringsPerAdultCompetitor * state.training.stringUnitCost;
    const competitorShuttleNet = adultBoxes * state.shuttle.costPerBox - shuttleRevenue;
    const competitorShuttleCostPerPlayer = competitorShuttleNet / Math.max(1, adultCompetitorMembers);
    const freePlayCostPerBeneficiary = freePlayExpense / Math.max(1, freePlayBeneficiaries);
    const stringingCostPerCompetitor = stringingExpense / Math.max(1, adultCompetitorMembers);
    const youthTrainingCostPerYouth = youthTrainingExpense / Math.max(1, youthMembers);
    const categoryCosts = state.members.map((member) => {
      const licensePerPlayer = member.federal + member.territorial;
      const isAdultCompetitor = hasAdultCompetitionBenefits(member);
      const isYouth = member.key === "minibad" || member.key.startsWith("young");
      const shuttlePerPlayer = isAdultCompetitor
        ? competitorShuttleCostPerPlayer
        : isYouth
          ? youthTrainingCostPerYouth
          : 0;
      const hasFreePlayShuttles = isAdultCompetitor || member.key === "external";
      const freePlayPerPlayer = hasFreePlayShuttles ? freePlayCostPerBeneficiary : 0;
      const stringingPerPlayer = isAdultCompetitor ? stringingCostPerCompetitor : 0;
      const costPerPlayer = licensePerPlayer + shuttlePerPlayer + freePlayPerPlayer + stringingPerPlayer;
      return {
        key: member.key,
        label: member.label,
        count: member.count,
        fee: member.fee,
        licensePerPlayer,
        shuttlePerPlayer,
        freePlayPerPlayer,
        stringingPerPlayer,
        netPerPlayer: member.fee - costPerPlayer,
      };
    });

    const revenueItems = [
      ["Adhésions", membershipRevenue],
      ["Manifestations", eventRevenue],
      ["Ventes volants", shuttleRevenue],
      ["Subventions", state.other.cityGrant],
      ["Stages", state.training.coachingAndStages],
    ];

    const expenseItems = [
      ["Licences FFBaD", licenseExpense],
      ["Manifestations", eventExpense],
      ["Volants", shuttleExpense],
      ["Entraîneurs / stages", trainingExpense],
      ["Cordages compétiteurs", stringingExpense],
      ["Vie du club", state.other.clubLife],
      ["Autres", state.other.bankFees + state.other.miscExpense],
    ];

    const revenue = revenueItems.reduce((sum, item) => sum + item[1], 0);
    const expense = expenseItems.reduce((sum, item) => sum + item[1], 0);
    const result = revenue - expense;

    return {
      totalMembers,
      adultCompetitorMembers,
      categoryCosts,
      totalBoxes: totalBoxes + freePlayBoxes,
      membershipRevenue,
      licenseNet: membershipRevenue - licenseExpense,
      shuttleRevenue,
      shuttleExpense,
      shuttleSubsidy,
      freePlayBoxes,
      freePlayWeeks,
      freePlayExpense,
      youthTrainingBoxes,
      youthTrainingExpense,
      stringingExpense,
      licenseExpense,
      organizedTournamentNet: eventRevenue - eventExpense,
      revenueItems,
      expenseItems,
      revenue,
      expense,
      result,
      cash: state.other.cashStart + result,
    };
  }

  function renderResults() {
    const totals = calculate();
    document.querySelector("#metricResult").textContent = money(totals.result);
    document.querySelector("#metricResult").className = totals.result >= 0 ? "positive" : "negative";
    document.querySelector("#metricResultDelta").textContent = `${signed(totals.result - reference.result)} vs bilan 2024-2025`;
    document.querySelector("#metricRevenue").textContent = money(totals.revenue);
    document.querySelector("#metricRevenueDelta").textContent = `${signed(totals.revenue - reference.revenue)} vs référence`;
    document.querySelector("#metricExpense").textContent = money(totals.expense);
    document.querySelector("#metricExpenseDelta").textContent = `${signed(totals.expense - reference.expense)} vs référence`;
    document.querySelector("#metricCash").textContent = money(totals.cash);

    document.querySelector("#licenseRevenue").textContent = money(totals.membershipRevenue);
    document.querySelector("#licenseCost").textContent = money(totals.licenseExpense);
    document.querySelector("#licenseNet").textContent = money(totals.licenseNet);
    document.querySelector("#licenseNet").className = totals.licenseNet >= 0 ? "positive" : "negative";
    document.querySelector("#licenseCostPerMember").textContent = `${money(
      totals.licenseExpense / Math.max(1, totals.totalMembers),
      true
    )} reversés / licencié`;
    document.querySelector("#shuttleRevenue").textContent = money(totals.shuttleRevenue);
    document.querySelector("#shuttleExpense").textContent = money(totals.shuttleExpense);
    document.querySelector("#shuttleSubsidy").textContent = money(totals.shuttleSubsidy);
    document.querySelector("#shuttleSubsidy").className = totals.shuttleSubsidy <= 0 ? "positive" : "negative";
    document.querySelector("#shuttleBoxes").textContent = `${Math.round(totals.totalBoxes)} boîtes simulées`;
    document.querySelector("#freePlayCost").textContent = money(totals.freePlayExpense);
    document.querySelector("#freePlayWeeks").textContent = `${totals.freePlayWeeks} semaines × ${state.shuttle.freePlayBoxesPerWeek} boîtes`;
    document.querySelector("#youthTrainingCost").textContent = money(totals.youthTrainingExpense);
    document.querySelector("#youthTrainingBoxes").textContent = `${totals.freePlayWeeks} semaines × ${state.shuttle.youthTrainingBoxesPerWeek} boîtes`;
    document.querySelector("#stringingCost").textContent = money(totals.stringingExpense);
    document.querySelector("#stringingCount").textContent = `${totals.adultCompetitorMembers} compétiteurs × ${state.training.stringsPerAdultCompetitor} cordages`;
    document.querySelector("#organizedTournamentNet").textContent = money(totals.organizedTournamentNet);
    renderCategoryTable(totals.categoryCosts);
    updateReferenceNotes();
  }

  function renderCategoryTable(categoryCosts) {
    elements.categoryTable.innerHTML = "";
    categoryCosts.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${category.label}</td>
        <td>${category.count}</td>
        <td class="flow-cell flow-revenue">${money(category.fee)}</td>
        <td class="flow-cell flow-expense">${money(category.licensePerPlayer, true)}</td>
        <td class="flow-cell flow-expense">${category.shuttlePerPlayer ? money(category.shuttlePerPlayer, true) : "-"}</td>
        <td class="flow-cell flow-expense">${category.freePlayPerPlayer ? money(category.freePlayPerPlayer, true) : "-"}</td>
        <td class="flow-cell flow-expense">${category.stringingPerPlayer ? money(category.stringingPerPlayer, true) : "-"}</td>
        <td><strong class="${category.netPerPlayer >= 0 ? "positive" : "negative"}">${money(category.netPerPlayer, true)}</strong></td>
      `;
      elements.categoryTable.appendChild(row);
    });
  }

  function handleInput(event) {
    const input = event.target;
    const section = input.dataset.section;
    const field = input.dataset.field;
    if (!section || !field) return;

    if (section === "members") {
      const member = state.members[Number(input.dataset.index)];
      member[field] = asNumber(input.value);
    } else if (section === "events") {
      const targetEvent = state.events[Number(input.dataset.index)];
      targetEvent[field] = input.type === "number" ? asNumber(input.value) : input.value;
      if (input.type === "number") {
        const row = input.closest("tr");
        const revenueCell = row && row.querySelector(".simulated-revenue");
        const netCell = row && row.querySelector('[data-role="event-net"]');
        if (netCell) {
          const projectedRevenue = getProjectedEventRevenue(targetEvent);
          const net = projectedRevenue - targetEvent.expense;
          if (revenueCell) revenueCell.textContent = money(projectedRevenue);
          netCell.textContent = money(net);
          netCell.className = net >= 0 ? "positive" : "negative";
        }
      }
    } else {
      state[section][field] = input.type === "date" ? input.value : asNumber(input.value);
    }

    saveState();
    renderResults();
  }

  function bindEvents() {
    document.body.addEventListener("input", handleInput);
    document.body.addEventListener("click", (event) => {
      const removeIndex = event.target.dataset.removeEvent;
      if (removeIndex !== undefined) {
        state.events.splice(Number(removeIndex), 1);
        saveState();
        renderEvents();
        renderResults();
      }
    });

    document.querySelector("#addTournamentButton").addEventListener("click", () => {
      state.events.push({
        name: "Nouvelle manifestation",
        detail: "Inscriptions, buvette",
        expense: 0,
        revenue: 0,
        registrationRevenue: 0,
        playerCount: 0,
        priceIncrease: 0,
      });
      saveState();
      renderEvents();
      renderResults();
    });

  }

  function renderAll() {
    renderMembers();
    renderControls("shuttle", elements.shuttleControls);
    renderControls("training", elements.trainingControls);
    renderControls("other", elements.otherControls);
    renderEvents();
    renderResults();
  }

  renderAll();
  bindEvents();
})();
