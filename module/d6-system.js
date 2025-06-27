class MyD6Actor extends Actor {
  prepareData() {
    super.prepareData();
    if (this.type !== "personaggio") return;

    const data = this.system;

    data.eta = Math.max(data.eta ?? 18, 18);
    data.abilita = {
      soldi: Math.min(data.abilita?.soldi ?? 0, 3),
      sangueFreddo: Math.min(data.abilita?.sangueFreddo ?? 0, 3),
      guida: Math.min(data.abilita?.guida ?? 0, 3),
      costituzione: Math.min(data.abilita?.costituzione ?? 1, 3),
      favori: Math.min(data.abilita?.favori ?? 0, 3)
    };
  }

  rollAbilita(tipo) {
    const val = this.system.abilita[tipo] || 0;
    const formula = `${val}d6`;
    const roll = new Roll(formula);
    roll.roll({ async: false });
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `Tiro per ${tipo.toUpperCase()} (${val}d6)`
    });
  }
}

Hooks.once("init", () => {
  console.log("The Project | Inizializzazione");

  // Associa solo il tipo "personaggio" a MyD6Actor
  CONFIG.Actor.documentClasses ??= {};
  CONFIG.Actor.documentClasses["personaggio"] = MyD6Actor;

  // Registra la scheda personalizzata
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("the-project", class extends ActorSheet {
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        template: "templates/actor-sheet.html",
        classes: ["the-project", "sheet", "actor"],
        width: 600,
        height: 500
      });
    }
  }, { types: ["personaggio"], makeDefault: true });
});

Hooks.on("renderActorSheet", (app, html) => {
  html.find("button[data-abilita]").click(ev => {
    const abilita = ev.currentTarget.dataset.abilita;
    app.actor.rollAbilita(abilita);
  });
});
