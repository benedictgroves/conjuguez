import { useState, useCallback, useRef, useEffect } from "react";

const PRONOUNS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
const ENGLISH_PRONOUNS = ["I", "you", "he/she", "we", "you", "they"];

const VERBS = {
  parler: {
    english: "to speak",
    english_conj: {
      présent: ["I speak", "you speak", "he/she speaks", "we speak", "you speak", "they speak"],
      "passé composé": ["I spoke", "you spoke", "he/she spoke", "we spoke", "you spoke", "they spoke"],
      imparfait: ["I used to speak", "you used to speak", "he/she used to speak", "we used to speak", "you used to speak", "they used to speak"],
      futur: ["I will speak", "you will speak", "he/she will speak", "we will speak", "you will speak", "they will speak"],
    },
    présent: ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
    "passé composé": ["ai parlé", "as parlé", "a parlé", "avons parlé", "avez parlé", "ont parlé"],
    imparfait: ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
    futur: ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
  },
  manger: {
    english: "to eat",
    english_conj: {
      présent: ["I eat", "you eat", "he/she eats", "we eat", "you eat", "they eat"],
      "passé composé": ["I ate", "you ate", "he/she ate", "we ate", "you ate", "they ate"],
      imparfait: ["I used to eat", "you used to eat", "he/she used to eat", "we used to eat", "you used to eat", "they used to eat"],
      futur: ["I will eat", "you will eat", "he/she will eat", "we will eat", "you will eat", "they will eat"],
    },
    présent: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
    "passé composé": ["ai mangé", "as mangé", "a mangé", "avons mangé", "avez mangé", "ont mangé"],
    imparfait: ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"],
    futur: ["mangerai", "mangeras", "mangera", "mangerons", "mangerez", "mangeront"],
  },
  aimer: {
    english: "to like / to love",
    english_conj: {
      présent: ["I like", "you like", "he/she likes", "we like", "you like", "they like"],
      "passé composé": ["I liked", "you liked", "he/she liked", "we liked", "you liked", "they liked"],
      imparfait: ["I used to like", "you used to like", "he/she used to like", "we used to like", "you used to like", "they used to like"],
      futur: ["I will like", "you will like", "he/she will like", "we will like", "you will like", "they will like"],
    },
    présent: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
    "passé composé": ["ai aimé", "as aimé", "a aimé", "avons aimé", "avez aimé", "ont aimé"],
    imparfait: ["aimais", "aimais", "aimait", "aimions", "aimiez", "aimaient"],
    futur: ["aimerai", "aimeras", "aimera", "aimerons", "aimerez", "aimeront"],
  },
  finir: {
    english: "to finish",
    english_conj: {
      présent: ["I finish", "you finish", "he/she finishes", "we finish", "you finish", "they finish"],
      "passé composé": ["I finished", "you finished", "he/she finished", "we finished", "you finished", "they finished"],
      imparfait: ["I used to finish", "you used to finish", "he/she used to finish", "we used to finish", "you used to finish", "they used to finish"],
      futur: ["I will finish", "you will finish", "he/she will finish", "we will finish", "you will finish", "they will finish"],
    },
    présent: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    "passé composé": ["ai fini", "as fini", "a fini", "avons fini", "avez fini", "ont fini"],
    imparfait: ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
    futur: ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
  },
  vendre: {
    english: "to sell",
    english_conj: {
      présent: ["I sell", "you sell", "he/she sells", "we sell", "you sell", "they sell"],
      "passé composé": ["I sold", "you sold", "he/she sold", "we sold", "you sold", "they sold"],
      imparfait: ["I used to sell", "you used to sell", "he/she used to sell", "we used to sell", "you used to sell", "they used to sell"],
      futur: ["I will sell", "you will sell", "he/she will sell", "we will sell", "you will sell", "they will sell"],
    },
    présent: ["vends", "vends", "vend", "vendons", "vendez", "vendent"],
    "passé composé": ["ai vendu", "as vendu", "a vendu", "avons vendu", "avez vendu", "ont vendu"],
    imparfait: ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"],
    futur: ["vendrai", "vendras", "vendra", "vendrons", "vendrez", "vendront"],
  },
  être: {
    english: "to be",
    english_conj: {
      présent: ["I am", "you are", "he/she is", "we are", "you are", "they are"],
      "passé composé": ["I was", "you were", "he/she was", "we were", "you were", "they were"],
      imparfait: ["I used to be", "you used to be", "he/she used to be", "we used to be", "you used to be", "they used to be"],
      futur: ["I will be", "you will be", "he/she will be", "we will be", "you will be", "they will be"],
    },
    présent: ["suis", "es", "est", "sommes", "êtes", "sont"],
    "passé composé": ["ai été", "as été", "a été", "avons été", "avez été", "ont été"],
    imparfait: ["étais", "étais", "était", "étions", "étiez", "étaient"],
    futur: ["serai", "seras", "sera", "serons", "serez", "seront"],
  },
  avoir: {
    english: "to have",
    english_conj: {
      présent: ["I have", "you have", "he/she has", "we have", "you have", "they have"],
      "passé composé": ["I had", "you had", "he/she had", "we had", "you had", "they had"],
      imparfait: ["I used to have", "you used to have", "he/she used to have", "we used to have", "you used to have", "they used to have"],
      futur: ["I will have", "you will have", "he/she will have", "we will have", "you will have", "they will have"],
    },
    présent: ["ai", "as", "a", "avons", "avez", "ont"],
    "passé composé": ["ai eu", "as eu", "a eu", "avons eu", "avez eu", "ont eu"],
    imparfait: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
    futur: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
  },
  aller: {
    english: "to go",
    english_conj: {
      présent: ["I go", "you go", "he/she goes", "we go", "you go", "they go"],
      "passé composé": ["I went", "you went", "he/she went", "we went", "you went", "they went"],
      imparfait: ["I used to go", "you used to go", "he/she used to go", "we used to go", "you used to go", "they used to go"],
      futur: ["I will go", "you will go", "he/she will go", "we will go", "you will go", "they will go"],
    },
    présent: ["vais", "vas", "va", "allons", "allez", "vont"],
    "passé composé": ["suis allé(e)", "es allé(e)", "est allé(e)", "sommes allé(e)s", "êtes allé(e)s", "sont allé(e)s"],
    imparfait: ["allais", "allais", "allait", "allions", "alliez", "allaient"],
    futur: ["irai", "iras", "ira", "irons", "irez", "iront"],
  },
  faire: {
    english: "to do / to make",
    english_conj: {
      présent: ["I do", "you do", "he/she does", "we do", "you do", "they do"],
      "passé composé": ["I did", "you did", "he/she did", "we did", "you did", "they did"],
      imparfait: ["I used to do", "you used to do", "he/she used to do", "we used to do", "you used to do", "they used to do"],
      futur: ["I will do", "you will do", "he/she will do", "we will do", "you will do", "they will do"],
    },
    présent: ["fais", "fais", "fait", "faisons", "faites", "font"],
    "passé composé": ["ai fait", "as fait", "a fait", "avons fait", "avez fait", "ont fait"],
    imparfait: ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
    futur: ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
  },
  pouvoir: {
    english: "to be able to / can",
    english_conj: {
      présent: ["I can", "you can", "he/she can", "we can", "you can", "they can"],
      "passé composé": ["I could", "you could", "he/she could", "we could", "you could", "they could"],
      imparfait: ["I used to be able", "you used to be able", "he/she used to be able", "we used to be able", "you used to be able", "they used to be able"],
      futur: ["I will be able", "you will be able", "he/she will be able", "we will be able", "you will be able", "they will be able"],
    },
    présent: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    "passé composé": ["ai pu", "as pu", "a pu", "avons pu", "avez pu", "ont pu"],
    imparfait: ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
    futur: ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
  },
  vouloir: {
    english: "to want",
    english_conj: {
      présent: ["I want", "you want", "he/she wants", "we want", "you want", "they want"],
      "passé composé": ["I wanted", "you wanted", "he/she wanted", "we wanted", "you wanted", "they wanted"],
      imparfait: ["I used to want", "you used to want", "he/she used to want", "we used to want", "you used to want", "they used to want"],
      futur: ["I will want", "you will want", "he/she will want", "we will want", "you will want", "they will want"],
    },
    présent: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    "passé composé": ["ai voulu", "as voulu", "a voulu", "avons voulu", "avez voulu", "ont voulu"],
    imparfait: ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
    futur: ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
  },
  venir: {
    english: "to come",
    english_conj: {
      présent: ["I come", "you come", "he/she comes", "we come", "you come", "they come"],
      "passé composé": ["I came", "you came", "he/she came", "we came", "you came", "they came"],
      imparfait: ["I used to come", "you used to come", "he/she used to come", "we used to come", "you used to come", "they used to come"],
      futur: ["I will come", "you will come", "he/she will come", "we will come", "you will come", "they will come"],
    },
    présent: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    "passé composé": ["suis venu(e)", "es venu(e)", "est venu(e)", "sommes venu(e)s", "êtes venu(e)s", "sont venu(e)s"],
    imparfait: ["venais", "venais", "venait", "venions", "veniez", "venaient"],
    futur: ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
  },
  prendre: {
    english: "to take",
    english_conj: {
      présent: ["I take", "you take", "he/she takes", "we take", "you take", "they take"],
      "passé composé": ["I took", "you took", "he/she took", "we took", "you took", "they took"],
      imparfait: ["I used to take", "you used to take", "he/she used to take", "we used to take", "you used to take", "they used to take"],
      futur: ["I will take", "you will take", "he/she will take", "we will take", "you will take", "they will take"],
    },
    présent: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    "passé composé": ["ai pris", "as pris", "a pris", "avons pris", "avez pris", "ont pris"],
    imparfait: ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
    futur: ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
  },
  savoir: {
    english: "to know (a fact)",
    english_conj: {
      présent: ["I know", "you know", "he/she knows", "we know", "you know", "they know"],
      "passé composé": ["I knew", "you knew", "he/she knew", "we knew", "you knew", "they knew"],
      imparfait: ["I used to know", "you used to know", "he/she used to know", "we used to know", "you used to know", "they used to know"],
      futur: ["I will know", "you will know", "he/she will know", "we will know", "you will know", "they will know"],
    },
    présent: ["sais", "sais", "sait", "savons", "savez", "savent"],
    "passé composé": ["ai su", "as su", "a su", "avons su", "avez su", "ont su"],
    imparfait: ["savais", "savais", "savait", "savions", "saviez", "savaient"],
    futur: ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"],
  },
  devoir: {
    english: "to have to / must",
    english_conj: {
      présent: ["I must", "you must", "he/she must", "we must", "you must", "they must"],
      "passé composé": ["I had to", "you had to", "he/she had to", "we had to", "you had to", "they had to"],
      imparfait: ["I used to have to", "you used to have to", "he/she used to have to", "we used to have to", "you used to have to", "they used to have to"],
      futur: ["I will have to", "you will have to", "he/she will have to", "we will have to", "you will have to", "they will have to"],
    },
    présent: ["dois", "dois", "doit", "devons", "devez", "doivent"],
    "passé composé": ["ai dû", "as dû", "a dû", "avons dû", "avez dû", "ont dû"],
    imparfait: ["devais", "devais", "devait", "devions", "deviez", "devaient"],
    futur: ["devrai", "devras", "devra", "devrons", "devrez", "devront"],
  },
  dire: {
    english: "to say / to tell",
    english_conj: {
      présent: ["I say", "you say", "he/she says", "we say", "you say", "they say"],
      "passé composé": ["I said", "you said", "he/she said", "we said", "you said", "they said"],
      imparfait: ["I used to say", "you used to say", "he/she used to say", "we used to say", "you used to say", "they used to say"],
      futur: ["I will say", "you will say", "he/she will say", "we will say", "you will say", "they will say"],
    },
    présent: ["dis", "dis", "dit", "disons", "dites", "disent"],
    "passé composé": ["ai dit", "as dit", "a dit", "avons dit", "avez dit", "ont dit"],
    imparfait: ["disais", "disais", "disait", "disions", "disiez", "disaient"],
    futur: ["dirai", "diras", "dira", "dirons", "direz", "diront"],
  },
  voir: {
    english: "to see",
    english_conj: {
      présent: ["I see", "you see", "he/she sees", "we see", "you see", "they see"],
      "passé composé": ["I saw", "you saw", "he/she saw", "we saw", "you saw", "they saw"],
      imparfait: ["I used to see", "you used to see", "he/she used to see", "we used to see", "you used to see", "they used to see"],
      futur: ["I will see", "you will see", "he/she will see", "we will see", "you will see", "they will see"],
    },
    présent: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
    "passé composé": ["ai vu", "as vu", "a vu", "avons vu", "avez vu", "ont vu"],
    imparfait: ["voyais", "voyais", "voyait", "voyions", "voyiez", "voyaient"],
    futur: ["verrai", "verras", "verra", "verrons", "verrez", "verront"],
  },
  croire: {
    english: "to believe",
    english_conj: {
      présent: ["I believe", "you believe", "he/she believes", "we believe", "you believe", "they believe"],
      "passé composé": ["I believed", "you believed", "he/she believed", "we believed", "you believed", "they believed"],
      imparfait: ["I used to believe", "you used to believe", "he/she used to believe", "we used to believe", "you used to believe", "they used to believe"],
      futur: ["I will believe", "you will believe", "he/she will believe", "we will believe", "you will believe", "they will believe"],
    },
    présent: ["crois", "crois", "croit", "croyons", "croyez", "croient"],
    "passé composé": ["ai cru", "as cru", "a cru", "avons cru", "avez cru", "ont cru"],
    imparfait: ["croyais", "croyais", "croyait", "croyions", "croyiez", "croyaient"],
    futur: ["croirai", "croiras", "croira", "croirons", "croirez", "croiront"],
  },
  mettre: {
    english: "to put / to place",
    english_conj: {
      présent: ["I put", "you put", "he/she puts", "we put", "you put", "they put"],
      "passé composé": ["I put", "you put", "he/she put", "we put", "you put", "they put"],
      imparfait: ["I used to put", "you used to put", "he/she used to put", "we used to put", "you used to put", "they used to put"],
      futur: ["I will put", "you will put", "he/she will put", "we will put", "you will put", "they will put"],
    },
    présent: ["mets", "mets", "met", "mettons", "mettez", "mettent"],
    "passé composé": ["ai mis", "as mis", "a mis", "avons mis", "avez mis", "ont mis"],
    imparfait: ["mettais", "mettais", "mettait", "mettions", "mettiez", "mettaient"],
    futur: ["mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront"],
  },
  lire: {
    english: "to read",
    english_conj: {
      présent: ["I read", "you read", "he/she reads", "we read", "you read", "they read"],
      "passé composé": ["I read", "you read", "he/she read", "we read", "you read", "they read"],
      imparfait: ["I used to read", "you used to read", "he/she used to read", "we used to read", "you used to read", "they used to read"],
      futur: ["I will read", "you will read", "he/she will read", "we will read", "you will read", "they will read"],
    },
    présent: ["lis", "lis", "lit", "lisons", "lisez", "lisent"],
    "passé composé": ["ai lu", "as lu", "a lu", "avons lu", "avez lu", "ont lu"],
    imparfait: ["lisais", "lisais", "lisait", "lisions", "lisiez", "lisaient"],
    futur: ["lirai", "liras", "lira", "lirons", "lirez", "liront"],
  },
  écrire: {
    english: "to write",
    english_conj: {
      présent: ["I write", "you write", "he/she writes", "we write", "you write", "they write"],
      "passé composé": ["I wrote", "you wrote", "he/she wrote", "we wrote", "you wrote", "they wrote"],
      imparfait: ["I used to write", "you used to write", "he/she used to write", "we used to write", "you used to write", "they used to write"],
      futur: ["I will write", "you will write", "he/she will write", "we will write", "you will write", "they will write"],
    },
    présent: ["écris", "écris", "écrit", "écrivons", "écrivez", "écrivent"],
    "passé composé": ["ai écrit", "as écrit", "a écrit", "avons écrit", "avez écrit", "ont écrit"],
    imparfait: ["écrivais", "écrivais", "écrivait", "écrivions", "écriviez", "écrivaient"],
    futur: ["écrirai", "écriras", "écrira", "écrirons", "écrirez", "écriront"],
  },
  dormir: {
    english: "to sleep",
    english_conj: {
      présent: ["I sleep", "you sleep", "he/she sleeps", "we sleep", "you sleep", "they sleep"],
      "passé composé": ["I slept", "you slept", "he/she slept", "we slept", "you slept", "they slept"],
      imparfait: ["I used to sleep", "you used to sleep", "he/she used to sleep", "we used to sleep", "you used to sleep", "they used to sleep"],
      futur: ["I will sleep", "you will sleep", "he/she will sleep", "we will sleep", "you will sleep", "they will sleep"],
    },
    présent: ["dors", "dors", "dort", "dormons", "dormez", "dorment"],
    "passé composé": ["ai dormi", "as dormi", "a dormi", "avons dormi", "avez dormi", "ont dormi"],
    imparfait: ["dormais", "dormais", "dormait", "dormions", "dormiez", "dormaient"],
    futur: ["dormirai", "dormiras", "dormira", "dormirons", "dormirez", "dormiront"],
  },
  sortir: {
    english: "to go out / to leave",
    english_conj: {
      présent: ["I go out", "you go out", "he/she goes out", "we go out", "you go out", "they go out"],
      "passé composé": ["I went out", "you went out", "he/she went out", "we went out", "you went out", "they went out"],
      imparfait: ["I used to go out", "you used to go out", "he/she used to go out", "we used to go out", "you used to go out", "they used to go out"],
      futur: ["I will go out", "you will go out", "he/she will go out", "we will go out", "you will go out", "they will go out"],
    },
    présent: ["sors", "sors", "sort", "sortons", "sortez", "sortent"],
    "passé composé": ["suis sorti(e)", "es sorti(e)", "est sorti(e)", "sommes sorti(e)s", "êtes sorti(e)s", "sont sorti(e)s"],
    imparfait: ["sortais", "sortais", "sortait", "sortions", "sortiez", "sortaient"],
    futur: ["sortirai", "sortiras", "sortira", "sortirons", "sortirez", "sortiront"],
  },
  partir: {
    english: "to leave / to depart",
    english_conj: {
      présent: ["I leave", "you leave", "he/she leaves", "we leave", "you leave", "they leave"],
      "passé composé": ["I left", "you left", "he/she left", "we left", "you left", "they left"],
      imparfait: ["I used to leave", "you used to leave", "he/she used to leave", "we used to leave", "you used to leave", "they used to leave"],
      futur: ["I will leave", "you will leave", "he/she will leave", "we will leave", "you will leave", "they will leave"],
    },
    présent: ["pars", "pars", "part", "partons", "partez", "partent"],
    "passé composé": ["suis parti(e)", "es parti(e)", "est parti(e)", "sommes parti(e)s", "êtes parti(e)s", "sont parti(e)s"],
    imparfait: ["partais", "partais", "partait", "partions", "partiez", "partaient"],
    futur: ["partirai", "partiras", "partira", "partirons", "partirez", "partiront"],
  },
  donner: {
    english: "to give",
    english_conj: {
      présent: ["I give", "you give", "he/she gives", "we give", "you give", "they give"],
      "passé composé": ["I gave", "you gave", "he/she gave", "we gave", "you gave", "they gave"],
      imparfait: ["I used to give", "you used to give", "he/she used to give", "we used to give", "you used to give", "they used to give"],
      futur: ["I will give", "you will give", "he/she will give", "we will give", "you will give", "they will give"],
    },
    présent: ["donne", "donnes", "donne", "donnons", "donnez", "donnent"],
    "passé composé": ["ai donné", "as donné", "a donné", "avons donné", "avez donné", "ont donné"],
    imparfait: ["donnais", "donnais", "donnait", "donnions", "donniez", "donnaient"],
    futur: ["donnerai", "donneras", "donnera", "donnerons", "donnerez", "donneront"],
  },
  trouver: {
    english: "to find",
    english_conj: {
      présent: ["I find", "you find", "he/she finds", "we find", "you find", "they find"],
      "passé composé": ["I found", "you found", "he/she found", "we found", "you found", "they found"],
      imparfait: ["I used to find", "you used to find", "he/she used to find", "we used to find", "you used to find", "they used to find"],
      futur: ["I will find", "you will find", "he/she will find", "we will find", "you will find", "they will find"],
    },
    présent: ["trouve", "trouves", "trouve", "trouvons", "trouvez", "trouvent"],
    "passé composé": ["ai trouvé", "as trouvé", "a trouvé", "avons trouvé", "avez trouvé", "ont trouvé"],
    imparfait: ["trouvais", "trouvais", "trouvait", "trouvions", "trouviez", "trouvaient"],
    futur: ["trouverai", "trouveras", "trouvera", "trouverons", "trouverez", "trouveront"],
  },
  penser: {
    english: "to think",
    english_conj: {
      présent: ["I think", "you think", "he/she thinks", "we think", "you think", "they think"],
      "passé composé": ["I thought", "you thought", "he/she thought", "we thought", "you thought", "they thought"],
      imparfait: ["I used to think", "you used to think", "he/she used to think", "we used to think", "you used to think", "they used to think"],
      futur: ["I will think", "you will think", "he/she will think", "we will think", "you will think", "they will think"],
    },
    présent: ["pense", "penses", "pense", "pensons", "pensez", "pensent"],
    "passé composé": ["ai pensé", "as pensé", "a pensé", "avons pensé", "avez pensé", "ont pensé"],
    imparfait: ["pensais", "pensais", "pensait", "pensions", "pensiez", "pensaient"],
    futur: ["penserai", "penseras", "pensera", "penserons", "penserez", "penseront"],
  },
  attendre: {
    english: "to wait",
    english_conj: {
      présent: ["I wait", "you wait", "he/she waits", "we wait", "you wait", "they wait"],
      "passé composé": ["I waited", "you waited", "he/she waited", "we waited", "you waited", "they waited"],
      imparfait: ["I used to wait", "you used to wait", "he/she used to wait", "we used to wait", "you used to wait", "they used to wait"],
      futur: ["I will wait", "you will wait", "he/she will wait", "we will wait", "you will wait", "they will wait"],
    },
    présent: ["attends", "attends", "attend", "attendons", "attendez", "attendent"],
    "passé composé": ["ai attendu", "as attendu", "a attendu", "avons attendu", "avez attendu", "ont attendu"],
    imparfait: ["attendais", "attendais", "attendait", "attendions", "attendiez", "attendaient"],
    futur: ["attendrai", "attendras", "attendra", "attendrons", "attendrez", "attendront"],
  },
  répondre: {
    english: "to answer",
    english_conj: {
      présent: ["I answer", "you answer", "he/she answers", "we answer", "you answer", "they answer"],
      "passé composé": ["I answered", "you answered", "he/she answered", "we answered", "you answered", "they answered"],
      imparfait: ["I used to answer", "you used to answer", "he/she used to answer", "we used to answer", "you used to answer", "they used to answer"],
      futur: ["I will answer", "you will answer", "he/she will answer", "we will answer", "you will answer", "they will answer"],
    },
    présent: ["réponds", "réponds", "répond", "répondons", "répondez", "répondent"],
    "passé composé": ["ai répondu", "as répondu", "a répondu", "avons répondu", "avez répondu", "ont répondu"],
    imparfait: ["répondais", "répondais", "répondait", "répondions", "répondiez", "répondaient"],
    futur: ["répondrai", "répondras", "répondra", "répondrons", "répondrez", "répondront"],
  },
  choisir: {
    english: "to choose",
    english_conj: {
      présent: ["I choose", "you choose", "he/she chooses", "we choose", "you choose", "they choose"],
      "passé composé": ["I chose", "you chose", "he/she chose", "we chose", "you chose", "they chose"],
      imparfait: ["I used to choose", "you used to choose", "he/she used to choose", "we used to choose", "you used to choose", "they used to choose"],
      futur: ["I will choose", "you will choose", "he/she will choose", "we will choose", "you will choose", "they will choose"],
    },
    présent: ["choisis", "choisis", "choisit", "choisissons", "choisissez", "choisissent"],
    "passé composé": ["ai choisi", "as choisi", "a choisi", "avons choisi", "avez choisi", "ont choisi"],
    imparfait: ["choisissais", "choisissais", "choisissait", "choisissions", "choisissiez", "choisissaient"],
    futur: ["choisirai", "choisiras", "choisira", "choisirons", "choisirez", "choisiront"],
  },
  connaître: {
    english: "to know (a person/place)",
    english_conj: {
      présent: ["I know", "you know", "he/she knows", "we know", "you know", "they know"],
      "passé composé": ["I knew", "you knew", "he/she knew", "we knew", "you knew", "they knew"],
      imparfait: ["I used to know", "you used to know", "he/she used to know", "we used to know", "you used to know", "they used to know"],
      futur: ["I will know", "you will know", "he/she will know", "we will know", "you will know", "they will know"],
    },
    présent: ["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"],
    "passé composé": ["ai connu", "as connu", "a connu", "avons connu", "avez connu", "ont connu"],
    imparfait: ["connaissais", "connaissais", "connaissait", "connaissions", "connaissiez", "connaissaient"],
    futur: ["connaîtrai", "connaîtras", "connaîtra", "connaîtrons", "connaîtrez", "connaîtront"],
  },
  boire: {
    english: "to drink",
    english_conj: {
      présent: ["I drink", "you drink", "he/she drinks", "we drink", "you drink", "they drink"],
      "passé composé": ["I drank", "you drank", "he/she drank", "we drank", "you drank", "they drank"],
      imparfait: ["I used to drink", "you used to drink", "he/she used to drink", "we used to drink", "you used to drink", "they used to drink"],
      futur: ["I will drink", "you will drink", "he/she will drink", "we will drink", "you will drink", "they will drink"],
    },
    présent: ["bois", "bois", "boit", "buvons", "buvez", "boivent"],
    "passé composé": ["ai bu", "as bu", "a bu", "avons bu", "avez bu", "ont bu"],
    imparfait: ["buvais", "buvais", "buvait", "buvions", "buviez", "buvaient"],
    futur: ["boirai", "boiras", "boira", "boirons", "boirez", "boiront"],
  },
  vivre: {
    english: "to live",
    english_conj: {
      présent: ["I live", "you live", "he/she lives", "we live", "you live", "they live"],
      "passé composé": ["I lived", "you lived", "he/she lived", "we lived", "you lived", "they lived"],
      imparfait: ["I used to live", "you used to live", "he/she used to live", "we used to live", "you used to live", "they used to live"],
      futur: ["I will live", "you will live", "he/she will live", "we will live", "you will live", "they will live"],
    },
    présent: ["vis", "vis", "vit", "vivons", "vivez", "vivent"],
    "passé composé": ["ai vécu", "as vécu", "a vécu", "avons vécu", "avez vécu", "ont vécu"],
    imparfait: ["vivais", "vivais", "vivait", "vivions", "viviez", "vivaient"],
    futur: ["vivrai", "vivras", "vivra", "vivrons", "vivrez", "vivront"],
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
    verbs: ["parler", "manger", "aimer", "donner", "trouver", "penser"],
    label: "-er verbs",
    guide: {
      présent: "Drop the -er, then add: -e, -es, -e, -ons, -ez, -ent. The je/tu/il and ils forms all sound the same — the endings are silent.",
      "passé composé": "Use avoir + past participle. The past participle is formed by replacing -er with -é (parler → parlé).",
      imparfait: "Take the nous form of the présent (e.g. parlons), drop -ons, then add: -ais, -ais, -ait, -ions, -iez, -aient.",
      futur: "Keep the full infinitive as the stem, then add: -ai, -as, -a, -ons, -ez, -ont. These endings look like the verb avoir!",
    },
  },
  "-ir": {
    verbs: ["finir", "choisir", "dormir", "sortir", "partir"],
    label: "-ir verbs",
    guide: {
      présent: "Drop the -ir, then add: -is, -is, -it, -issons, -issez, -issent. Notice the -iss- that appears in the plural forms — it's the hallmark of regular -ir verbs.",
      "passé composé": "Use avoir + past participle. Replace -ir with -i (finir → fini).",
      imparfait: "Take the nous présent form (finissons), drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient. The -iss- carries through.",
      futur: "Keep the full infinitive as the stem, then add: -ai, -as, -a, -ons, -ez, -ont.",
    },
  },
  "-re": {
    verbs: ["vendre", "attendre", "répondre"],
    label: "-re verbs",
    guide: {
      présent: "Drop the -re, then add: -s, -s, (nothing), -ons, -ez, -ent. Notice il/elle has no ending at all — just the bare stem.",
      "passé composé": "Use avoir + past participle. Replace -re with -u (vendre → vendu).",
      imparfait: "Take the nous présent form (vendons), drop -ons, add: -ais, -ais, -ait, -ions, -iez, -aient. Same pattern as -er and -ir.",
      futur: "Drop the final -e from the infinitive to get the stem (vendr-), then add: -ai, -as, -a, -ons, -ez, -ont.",
    },
  },
  irregular: {
    verbs: ["être", "avoir", "aller", "faire", "pouvoir", "vouloir", "venir", "prendre", "savoir", "devoir", "dire", "voir", "croire", "mettre", "lire", "écrire", "connaître", "boire", "vivre"],
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

function englishVerbOnly(verb, tense, i) {
  const full = VERBS[verb].english_conj[tense][i];
  const pronoun = ENGLISH_PRONOUNS[i];
  return full.startsWith(`${pronoun} `) ? full.slice(pronoun.length + 1) : full;
}

// 'normal': French pronoun label, drag the French verb.
// 'en-sentence': English sentence label, drag the French pronoun + French verb.
// 'fr-sentence': French sentence label, drag the English pronoun + English verb.
const MODES = [
  { key: "normal", label: "French pronouns" },
  { key: "en-sentence", label: "English sentence" },
  { key: "fr-sentence", label: "French sentence" },
];

function makeChips(verb, mode) {
  const data = VERBS[verb];
  const verbChips = [];
  TENSES.forEach((tense) => {
    PRONOUNS.forEach((_, i) => {
      const key = `${tense}--${i}`;
      verbChips.push({
        id: key,
        text: mode === "fr-sentence" ? englishVerbOnly(verb, tense, i) : data[tense][i],
        tense,
        pronounIdx: i,
      });
    });
  });

  // Pronoun order stays fixed (je, tu, il/elle, nous, vous, ils/elles) since it's a reference pool, not a puzzle.
  verbChips.sort((a, b) => a.text.localeCompare(b.text, "fr"));
  return { verbChips };
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

function AnswerCell({ kind, tense, i, placed, isCorrect, isWrong, isDragOver, canTap, checked, colors, onDrop, onRemove, onSlotTap, onDragOver, onDragLeave }) {
  return (
    <div
      data-slot={`${tense}|${i}`}
      data-kind={kind}
      onClick={() => {
        if (canTap) onSlotTap(kind, tense, i);
        else if (placed && !checked) onRemove(kind, tense, i);
      }}
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDragLeave();
        try {
          const { kind: droppedKind, ...chip } = JSON.parse(e.dataTransfer.getData("text/plain"));
          if (droppedKind === kind) onDrop(kind, tense, i, chip);
        } catch {}
      }}
      style={{
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
        cursor: canTap ? "pointer" : placed && !checked ? "pointer" : "default",
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
  );
}

function ChipTray({ label, chips, kind, selectedChip, dragging, checked, tenseFilter, setTenseFilter, onDragStart, onDragEnd, onChipTap }) {
  const filtered = chips.filter((c) => !tenseFilter || c.tense === tenseFilter);
  return (
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
          {label} ({chips.length} remaining)
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
        {chips.length === 0 && !checked && (
          <span style={{ fontSize: 13, color: "#7B8DB0", fontStyle: "italic" }}>
            All placed — check your answers below
          </span>
        )}
        {filtered.length === 0 && chips.length > 0 && (
          <span style={{ fontSize: 13, color: "#7B8DB0", fontStyle: "italic" }}>
            No remaining chips for this tense
          </span>
        )}
        {filtered.map((chip) => {
          const colors = TENSE_COLORS[chip.tense];
          const isSelected = selectedChip?.kind === kind && selectedChip?.chip.id === chip.id;
          const isDragging = dragging?.kind === kind && dragging?.id === chip.id;
          return (
            <div
              key={chip.id}
              draggable={!checked}
              onDragStart={(e) => {
                onDragStart(chip);
                e.dataTransfer.setData("text/plain", JSON.stringify({ ...chip, kind }));
              }}
              onDragEnd={onDragEnd}
              onClick={() => onChipTap(chip)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "5px 12px",
                borderRadius: 6,
                background: isSelected ? colors.border : "rgba(255,255,255,0.9)",
                color: isSelected ? "#fff" : "#1E293B",
                border: `1.5px solid ${isSelected ? colors.border : "rgba(255,255,255,0.2)"}`,
                cursor: checked ? "default" : "grab",
                opacity: isDragging ? 0.4 : 1,
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
  );
}

export default function FrenchVerbApp() {
  const verbNames = Object.keys(VERBS).sort((a, b) => a.localeCompare(b, 'fr'));
  const [verb, setVerb] = useState(() => verbNames[Math.floor(Math.random() * verbNames.length)]);
  const [mode, setMode] = useState("normal");
  const [chipSets, setChipSets] = useState(() => makeChips(verb, mode));
  const { verbChips } = chipSets;
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
  const [showEnglish, setShowEnglish] = useState(false);

  const filteredVerbNames = groupFilter
    ? verbNames.filter((v) => VERB_GROUPS[groupFilter].verbs.includes(v))
    : verbNames;

  const availableVerbChips = verbChips.filter(
    (c) => !Object.values(placements).find((p) => p && p.id === c.id)
  );

  const handleDrop = useCallback((kind, tense, pronounIdx, chip) => {
    if (checked) return;
    setPlacements((prev) => {
      const next = { ...prev };
      // Verb chips are single-use — placing one elsewhere frees its old slot.
      Object.keys(next).forEach((k) => {
        if (next[k] && next[k].id === chip.id) next[k] = null;
      });
      const key = `${tense}--${pronounIdx}`;
      next[key] = chip;
      return next;
    });
  }, [checked]);

  const handleRemove = useCallback((kind, tense, pronounIdx) => {
    if (checked) return;
    setPlacements((prev) => ({ ...prev, [`${tense}--${pronounIdx}`]: null }));
  }, [checked]);

  const handleCheck = () => {
    let correct = 0;
    let total = 24;
    const corr = {};
    TENSES.forEach((tense) => {
      PRONOUNS.forEach((_, i) => {
        const key = `${tense}--${i}`;
        const verbOk = !!(placements[key] && placements[key].id === key);
        corr[key] = { verb: verbOk };
        if (verbOk) correct++;
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
    setChipSets(makeChips(chosen, mode));
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
    setChipSets(makeChips(v, mode));
    setPlacements({});
    setChecked(false);
    setCorrections(null);
    setScore(null);
    setTenseFilter(null);
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setChipSets(makeChips(verb, nextMode));
    setPlacements({});
    setChecked(false);
    setCorrections(null);
    setScore(null);
  };

  const filledCount = TENSES.reduce((acc, tense) => acc + PRONOUNS.reduce((acc2, _, i) => {
    const key = `${tense}--${i}`;
    return acc2 + (placements[key] ? 1 : 0);
  }, 0), 0);

  // Touch handlers for mobile drag
  const handleTouchStart = (e, chip, kind) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchDrag({ chip, kind, x: touch.clientX, y: touch.clientY });
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
        handleDrop(touchDrag.kind, tense, parseInt(idx), touchDrag.chip);
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

  const handleChipTap = (chip, kind) => {
    if (checked) return;
    setSelectedChip(prev => (prev?.kind === kind && prev?.chip.id === chip.id) ? null : { chip, kind });
  };

  const handleSlotTap = (kind, tense, pronounIdx) => {
    if (checked || !selectedChip || selectedChip.kind !== kind) return;
    handleDrop(kind, tense, pronounIdx, selectedChip.chip);
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
        <button
          onClick={() => setShowEnglish(!showEnglish)}
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: showEnglish ? "#2563EB" : "#8B9CC0",
            background: showEnglish ? "#EFF6FF" : "rgba(255,255,255,0.06)",
            border: `1.5px solid ${showEnglish ? "#3B82F6" : "#3D4F6F"}`,
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
            background: showEnglish ? "#3B82F6" : "#CBD5E1",
            position: "relative",
            display: "inline-block",
            transition: "background 0.2s",
          }}>
            <span style={{
              position: "absolute",
              top: 2,
              left: showEnglish ? 16 : 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }} />
          </span>
          Show English
        </button>
        <div style={{
          marginTop: 10,
          display: "inline-flex",
          gap: 3,
          padding: 3,
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid #3D4F6F",
          borderRadius: 20,
          verticalAlign: "middle",
        }}>
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => handleModeChange(m.key)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 16,
                  border: "none",
                  background: active ? "#F59E0B" : "transparent",
                  color: active ? "#1B2A4A" : "#8B9CC0",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
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

      {showEnglish && (
        <div style={{
          textAlign: "center",
          marginBottom: 16,
          fontSize: 15,
          fontWeight: 500,
          color: "#93AEDB",
          fontStyle: "italic",
        }}>
          {verb} — {VERBS[verb].english}
        </div>
      )}

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
              showEnglish={showEnglish}
              mode={mode}
            />
          </div>
        ))}
      </div>

      {/* Chip tray */}
      <ChipTray
        label={mode === "normal" ? "Conjugations" : mode === "fr-sentence" ? "English verbs" : "French verbs"}
        chips={availableVerbChips}
        kind="verb"
        selectedChip={selectedChip}
        dragging={dragging}
        checked={checked}
        tenseFilter={tenseFilter}
        setTenseFilter={setTenseFilter}
        onDragStart={(chip) => setDragging({ kind: "verb", id: chip.id })}
        onDragEnd={() => setDragging(null)}
        onChipTap={(chip) => handleChipTap(chip, "verb")}
      />

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {filledCount > 0 && instantMode && (() => {
          let correct = 0;
          TENSES.forEach((tense) => {
            PRONOUNS.forEach((_, i) => {
              const key = `${tense}--${i}`;
              const verbOk = placements[key] && placements[key].id === key;
              if (verbOk) correct++;
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
        {!instantMode && !checked && (
          <button
            onClick={handleCheck}
            disabled={filledCount < 24}
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: filledCount < 24 ? "#475569" : "#4338CA",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              cursor: filledCount < 24 ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            Check answers ({filledCount}/24)
          </button>
        )}
        {!instantMode && checked && (() => {
          let correct = 0;
          TENSES.forEach((tense) => {
            PRONOUNS.forEach((_, i) => {
              const key = `${tense}--${i}`;
              const verbOk = placements[key] && placements[key].id === key;
              if (verbOk) correct++;
            });
          });
          return (
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: correct === 24 ? "#15803D" : correct >= 18 ? "#B45309" : "#B91C1C",
            }}>
              {correct}/24
              {correct === 24 && " 🎉"}
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
function QuadrantWithSlotTap({ tense, verb, placements, onDrop, onRemove, checked, corrections, selectedChip, onSlotTap, instantMode, showEnglish, mode }) {
  const colors = TENSE_COLORS[tense];
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const data = VERBS[verb];
  const twoBox = mode !== "normal";

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
        {PRONOUNS.map((_, i) => {
          const rowLabel = mode === "en-sentence" ? data.english_conj[tense][i]
            : mode === "fr-sentence" ? `${PRONOUNS[i]} ${data[tense][i]}`
            : PRONOUNS[i];
          const key = `${tense}--${i}`;

          const verbPlaced = placements[key] || null;
          const verbInstantCorrect = instantMode && verbPlaced && verbPlaced.id === key;
          const verbInstantWrong = instantMode && verbPlaced && verbPlaced.id !== key;
          const verbCheckedCorrect = checked && corrections && corrections[key]?.verb;
          const verbCheckedWrong = checked && corrections && corrections[key] && !corrections[key].verb && verbPlaced;
          const verbCorrect = verbInstantCorrect || verbCheckedCorrect;
          const verbWrong = verbInstantWrong || verbCheckedWrong;
          const verbCanTap = !checked && selectedChip?.kind === "verb" && !verbPlaced;

          const pronoun = mode === "fr-sentence" ? ENGLISH_PRONOUNS[i] : PRONOUNS[i];

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 0",
                borderBottom: i < 5 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <span style={{
                width: showEnglish || twoBox ? 'auto' : 72,
                minWidth: 72,
                fontSize: 13,
                color: "#64748B",
                fontStyle: "italic",
                textAlign: "right",
                flexShrink: 0,
              }}>
                {rowLabel}
                {showEnglish && !twoBox && data.english_conj && (
                  <span style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    fontStyle: "normal",
                    marginLeft: 4,
                  }}>
                    ({data.english_conj[tense][i]})
                  </span>
                )}
              </span>
              {twoBox && (
                <span style={{
                  minWidth: 72,
                  fontSize: 13,
                  color: "#64748B",
                  fontStyle: "italic",
                  textAlign: "right",
                  flexShrink: 0,
                }}>
                  {pronoun}
                </span>
              )}
              <AnswerCell
                kind="verb"
                tense={tense}
                i={i}
                placed={verbPlaced}
                isCorrect={verbCorrect}
                isWrong={verbWrong}
                isDragOver={dragOverSlot === `verb-${i}`}
                canTap={verbCanTap}
                checked={checked}
                colors={colors}
                onDrop={onDrop}
                onRemove={onRemove}
                onSlotTap={onSlotTap}
                onDragOver={() => setDragOverSlot(`verb-${i}`)}
                onDragLeave={() => setDragOverSlot(null)}
              />
            </div>
          );
        })}
      </div>
      {checked && corrections && (
        <div style={{ padding: "4px 14px 10px" }}>
          {PRONOUNS.map((_, i) => {
            const key = `${tense}--${i}`;
            const c = corrections[key];
            if (c && c.verb) return null;
            const label = mode === "en-sentence" ? data.english_conj[tense][i]
              : mode === "fr-sentence" ? `${PRONOUNS[i]} ${data[tense][i]}`
              : PRONOUNS[i];
            const answer = mode === "fr-sentence" ? `${ENGLISH_PRONOUNS[i]} ${englishVerbOnly(verb, tense, i)}`
              : mode === "en-sentence" ? `${PRONOUNS[i]} ${data[tense][i]}`
              : data[tense][i];
            return (
              <div key={i} style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                {label} → <strong style={{ color: colors.head }}>{answer}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
