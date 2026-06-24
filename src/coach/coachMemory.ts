import type { CoachMessage } from "./coachTypes";

let memory: CoachMessage[] = [];

export function getMemory() {
  return memory;
}

export function addMessage(message: CoachMessage) {
  memory.push(message);
}

export function clearMemory() {
  memory = [];
}