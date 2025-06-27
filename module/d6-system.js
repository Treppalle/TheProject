class MyD6Actor extends Actor {
  prepareData() {
    super.prepareData();

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

Hooks.once("init", function () {
  console.log("My D6 System | Inizializzazione");
  CONFIG.Actor.documentClass = MyD6Actor;
});

Hooks.on("renderActorSheet", (app, html, data) => {
  html.find("button[data-abilita]").click(ev => {
    const abilita = ev.currentTarget.dataset.abilita;
    app.actor.rollAbilita(abilita);
  });
});
