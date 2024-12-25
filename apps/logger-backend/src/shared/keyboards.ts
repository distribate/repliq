import { Keyboard } from "gramio";

export const startKeyboardData = ["Объявление", "Погода", "Список админов", "Управление"];
export const controlKeyboardData = ["Добавить администратора", "Удалить администратора"];

export const backButton = "Назад"

export const stateToKeyboard = {
  main: new Keyboard().columns(3).add(...startKeyboardData.map((x) => Keyboard.text(x))),
  control: new Keyboard().columns(3).add(...controlKeyboardData.map((x) => Keyboard.text(x)), Keyboard.text(backButton)).oneTime(true)
};