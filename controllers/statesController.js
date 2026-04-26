const statesData = require('../model/statesData.json');
const State = require('../model/state');

// Helper
const getStateByCode = (code) => {
    return statesData.find(s => s.code === code);
    };

// Get /states
const getAllStates = async (req, res) => {
    const contig = req.query.contig;

    let states = statesData;

    if (contig === "true") {
        states = statesData.filter(s => s.code !== "AK" && s.code !== "HI");
    } else if (contig === "false") {
        states = statesData.filter(s => s.code === "AK" || s.code === "HI");
    }

    const funFacts = await State.find();

    const merged = states.map(state => {
        const match = funFacts.find(f => f.stateCode === state.code);
        return match ? { ...state, funfacts: match.funfacts } : state;
    });

    res.json(merged);
};

//Get /states/:state
const getState = async (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = getStateByCode(code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    const funFacts = await State.findOne({ stateCode: code });

    if (funFacts) {
        state.funfacts = funFacts.funfacts;
    }

    res.json(state);
};

// Get random fun fact
const getFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = getStateByCode(code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    const doc = await State.findOne({ stateCode: code });

    if (!doc || !doc.funfacts || doc.funfacts.length === 0) {
        return res.status(404).json({
            message: `No Fun Facts Found for ${state.state}`
        });
    }

    const random = Math.floor(Math.random() * doc.funfacts.length);

    res.json({ funfact: doc.funfacts[random] });
};

// Property routes
const getCapital = (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = getStateByCode(code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = getStateByCode(code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    };

    res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = getStateByCode(code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    res.json({ state: state.state, population: state.population.toLocaleString() });
};

const getAdmission = (req, res) => {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);

    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    res.json({ state: state.state, admitted: state.admission_date});
};

// Post
const addFunFacts = async (req, res) => {
    const code = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(404).json({ message: "State fun facts value required" });
    }

    if (!Array.isArray(funfacts)) {
        return res.status(404).json({ message: "State fun facts value must be an array" });
    }

    const state = getStateByCode(code);
    if (!state) {
        return res.status(404).json({ message: "Invalid state abbreviation parameter" });
    }

    let doc = await State.findOne({ stateCode: code });

    if (doc) {
        doc.funfacts.push(...funfacts);
    } else {
        doc = await State.create({ stateCode: code, funfacts });
    }

    await doc.save();

    res.json(doc);
};

// Patch
const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;

    if (!index) {
        return res.status(404).json({ message: "State fun fact index value required" });
    }

    if (!funfact) {
        return res.status(404).json({ message: "State fun fact value required" });
    }

    const code = req.params.state.toUpperCase();
    const doc = await State.findOne({ stateCode: code });

    if (!doc) {
        return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    if (index < 1 || index > doc.funfacts.length) {
        return res.status(404).json({ message: "Invalid index" });
    }

    doc.funfacts[index -1] = funfact;

    await doc.save();

    res.json(doc);
};

//Delete
const deleteFunFact = async (req, res) => {
    const { index } = req.body;

    if (!index) {
        return res.status(404).json({ message: "State fun fact index value required" });
    }

    const code = req.params.state.toUpperCase();
    const doc = await State.findOne({ stateCode: code });

    if (!doc) {
        return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    if (index < 1 || index > doc.funfacts.length) {
        return res.status(404).json({ message: "Invalid index" });
    }

    doc.funfacts.splice(index - 1, 1);

    await doc.save();

    res.json(doc);
};

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    addFunFacts,
    updateFunFact,
    deleteFunFact
};
