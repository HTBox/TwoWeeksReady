import { states } from "us";

const stateList = []

for (const id in states) stateList.push({ text: states[id].name, value: states[id].abbr});

export default stateList; 