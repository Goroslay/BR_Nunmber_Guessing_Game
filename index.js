#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function bienvenido() {
    const titulo = chalkAnimation.karaoke(
        "Bienvenido a adivina el numero"
    );
    await sleep();
    titulo.stop();

    console.log(`
        ${chalk.bgBlue("Como jugar")}
        Yo automaticamente elegiré un número entre 1 y 100.
        Tú tienes que adivinarlo y yo responderé:
        ${chalk.cyan("Muy frío: ")} si estás muy lejos del número.
        ${chalk.blue("Frío: ")} si estás lejos del número.
        ${chalk.yellow("Tibio: ")} si no estás ni cerca ni lejos del número.
        ${chalk.hex("#FFA500")("Caliente: ")} si estás cerca del número.
        ${chalk.red("Muy caliente: ")} si estás muy cerca del número.
        `);
}

async function preguntarNombre() {
    const pregunta = await inquirer.prompt({
        name: "nombre_del_jugador",
        type: "input",
        message: "¿Cuál es tu nombre?",
        default() {
            return "Nombre";
        }
    });

    return pregunta.nombre_del_jugador;
}

async function dificultad() {
    const respuesta = await inquirer.prompt({
        name: "dificultad",
        type: "list",
        message: "Elige la dificultad: ",
        choices: ["Fácil", "Normal", "Difícil"]
    });

    return respuesta.dificultad === "Fácil" ? 7 : respuesta.dificultad === "Normal" ? 5 : 3;
}

function calcularNumero() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

async function preguntaNumero(numero) {
    const pregunta = await inquirer.prompt({
        name: "numero", // Cambiado para que sea la clave correcta
        type: "input",
        message: "¿Cuál es el número?"
    });

    const esIgual = parseInt(numero) === parseInt(pregunta.numero);
    const diferencia = Math.abs(parseInt(numero) - parseInt(pregunta.numero));

    return [esIgual, diferencia];
}

async function juego() {
    await bienvenido();
    const jugador = await preguntarNombre();
    let vidas = await dificultad();
    const spinner = createSpinner("Calculando número...").start();
    const numero = calcularNumero();
    await sleep();
    spinner.stop();

    while (vidas > 0) {
        let [esCorrecto, diferencia] = await preguntaNumero(numero);
        if (esCorrecto) {
            const ganador = chalkAnimation.rainbow(
                `Bien hecho ${jugador} acertaste el numero!!!!`
            );
            await sleep();
            ganador.stop();
            break;
        } else {
            vidas--;
            let texto;
            if (diferencia > 50) {
                texto = `${chalk.cyan("Muy frío.")} Te quedan ${vidas} intentos.`;
            } else if (diferencia <= 50 && diferencia > 25) {
                texto = `${chalk.blue("Frío.")} Te quedan ${vidas} intentos.`;
            } else if (diferencia <= 25 && diferencia > 15) {
                texto = `${chalk.yellow("Tibio.")} Te quedan ${vidas} intentos.`;
            } else if (diferencia <= 15 && diferencia > 5) {
                texto = `${chalk.hex("#FFA500")("Caliente.")} Te quedan ${vidas} intentos.`;
            } else if (diferencia <= 5) {
                texto = `${chalk.red("Muy caliente.")} Te quedan ${vidas} intentos.`;
            }

            console.log(texto);
        }
    }

    if (vidas === 0) {
        console.log(chalk.red(`Lo siento, ${jugador}. No lograste adivinar el número era: ${numero}.`));
    }
}

await juego();
