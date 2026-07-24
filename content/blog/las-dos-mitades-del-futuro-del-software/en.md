---
title: "The two halves of software's future"
description: "Cognition built the engine that executes intention. Google built the format where intention is stored. Neither built the middle piece — and that piece is a writing problem, not a programming problem."
date: "2026-07-24"
tags:
  - essay
  - software
  - intention
  - AI
draft: false
---

*(and why the missing one is not written in code)*

Cognition built the engine that executes intention. Google built the format where intention is stored. Neither built the middle piece — and that piece is a writing problem, not a programming problem.

The two products this essay is about: [**Devin**](https://devin.ai/), from Cognition, the autonomous software engineer, and [**DESIGN.md**](https://github.com/google-labs-code/design.md), from Google Labs, the design-intention format for coding agents.

## Two companies built the same idea without naming it

There is a transformation underway in how software is made, and the strange part is that the two companies closest to completing it are not describing it as what it is. Each built one half. Neither says out loud that they are halves of the same thing.

This essay is about that thing. About why Devin, from Cognition, and DESIGN.md, from Google, are the two ends of a single structural inversion — and about why the missing piece in the middle, the one that would complete the future of software, is not a computer-science problem but a language problem.

To see it, we have to start a little further back, with a direction that runs through the entire history of software.

## For seventy years, software has moved in one direction

Dig down from any tool you use today and you find a tower: a framework on a library on a language on a runtime on a systems language on machine instructions on voltage. Every floor of that tower does the same thing: it uses the one below to pretend something more abstract, and it works precisely because it hides the floor below. You program at the high level without thinking about voltages because someone built that floor solid enough for you to stand on without looking down.

And there is a direction in how that tower grows. Each new layer turns a tedious “how” into a comfortable “what.” Assembler took ones and zeros away from you. High-level languages took assembler away from you. Every level brings you closer to saying what you want and farther from spelling out how to do it.

And notice that the mechanism that makes each of those jumps possible has a precise name: a **compiler**. A compiler takes a description written in a more abstract language and translates it into a more concrete one, filling in on its own all the implementation details you did not write. The whole tower, at bottom, is a stack of compilers: each layer translates the one above into the one below. Hold on to that word, because it is the one that matters.

The cleanest example of that direction is a UI library that is now standard. Before, updating the screen was a hell of manual instructions: “this data changed, find that element, tweak this bit, sync with that other one.” The idea that changed everything flipped it: you describe how the screen should look for each state, and the system computes the difference itself. You go from ordering changes to describing the result.

That has a structure worth isolating, because it is the key to everything that follows. You take two things you used to sync by hand — a state and a screen — and decide that one is the source and the other is the derivative. You own the source; the derivative compiles itself from it. You are not adding power toward the hardware: you are changing what is source and what is consequence. It is a conceptual inversion, not a higher floor. Let’s call it the **inversion mold**.

## Intention and code: the last pair we still sync by hand

Today there remains a pair we handle exactly as we once handled state and screen — by pure manual synchronization: **intention** and **code**.

You have an intention. You produce the code. And then the two live loose: intention evaporates, lives in your head and disappears, and code remains as the truth you store, edit, and version. You are the one running between them to keep them aligned. If a year from now you open a file, you see what was left, not what you meant it for — you have to reconstruct your own intention by reading the code backwards.

The next layer is to apply the inversion mold to that pair: that intention become the source of truth — what you store and version — and that code become the derivative, what compiles from intention each time, disposable like the screen rebuilt from state. In other words: that intention become the source language and code the compiled artifact — the intermediate object that nobody edits by hand anymore in the lower layers, and that would stop being edited by hand here too.

It is a lateral move, not an upward one. “Upward” would be more muscle: that the machine write better code, faster. That changes nothing structural — code remains king, with a better scribe. “Lateral” is something else: it does not touch the power, it changes where the truth lives.

And here is where it gets interesting, because that inversion has already begun to be built — but split in two, by two different companies that do not shake hands.

## The half that already exists: Cognition built the compiler

Devin, from Cognition, is the engine that takes an intention and executes it. You give it a task — a bug, a feature, a migration — and it plans, writes the code, runs the tests, and opens a pull request, all in its own environment with terminal, editor, and browser. It is not autocomplete: it is an autonomous agent. The fact that stopped the industry is that, inside Cognition, the vast majority of the code that gets committed is already written by Devin, not by a human. The intention-to-code compiler stopped being an idea and became a product billing at enterprise scale.

That is exactly the half of the bridge we call “to describe is to obtain.” You name the what and runnable code appears. The dead reference — “I want this” — became actionable.

But notice where the source of truth ends up, because that is the whole point. Devin delivers its work as a pull request. What gets reviewed, what gets merged, what gets versioned, what remains stored in the repository forever, is the code. The intention you gave it — the prompt, the task — evaporates just as it always did. Devin writes the overwhelming majority of the code, yes, but code is still king. Devin is an extraordinary compiler whose output is stored in place of its input: it changed who writes, not what the source is. It is half of the mold — compilation — without the other half — the persistent source. As if you had a brilliant C compiler, but versioned the binary and threw away the source code.

## The half that exists halfway: Google turned intention into source

DESIGN.md, from Google Labs, is the exact other half, and it is almost moving how complementary they are.

It is a markdown file that combines machine-readable tokens — in the front matter — with prose that explains why those values exist. An agent that reads it understands the design system and produces the right interface. It has its own PHILOSOPHY.md. It has a diff command that compares two versions and detects “prose regressions” — that is, it versions design intention as a first-class artifact. In days it gathered tens of thousands of stars.

That is the README as source, made product: an intention document that stops describing the result and starts generating it. It is the source language we were looking for — truth moves from code toward description. But it is the other half of the mold — the persistent source — without its own engine: DESIGN.md compiles nothing; it is a format, not a compiler. And it covers a single layer: the visual one. Color, typography, spacing tokens. Nothing more.

## What appears when you put the two halves side by side

Cognition has the compiler without the persistent source. It executes intention magnificently and then discards it; what it stores is the compiled artifact.

Google has the persistent source without the general compiler. It stores intention as the governing artifact, but only for design, and it compiles nothing by itself.

Put them together and the complete layer the direction had been announcing appears, exact: intention stored as source language + a compiler that translates it into the whole system, every time. The README as source plus the engine that runs it. Neither alone is the inversion. Both together are.

But between one and the other a piece is still missing, and it is a nameable piece: the **general intention format**. A “DESIGN.md for the entire system,” not only for visual tokens — a document where the rules, behaviors, decisions, and the why of a complete product live, with enough precision for a Devin-like engine to take it as its only source of truth and compile code from there, instead of treating intention as a prompt discarded after each task.

Google showed that design intention can be a versioned source language. Cognition showed that an intention can be compiled end to end. Nobody has yet shown the format where the intention of the complete system is stored as the truth and code hangs from it. That is the next paving stone on the path. And it is empty.

## No larger model will close this gap

It is tempting to think this gets solved with more power — that when Devin is good enough, the gap closes. No. The gap is not about capacity; it is about structure. You can have the most perfect compiler in the universe and, if it keeps delivering pull requests, the source of truth remains the code. More muscle inverts nothing; it only produces a better compiled artifact.

What closes the gap is a structural decision: choosing that the artifact you store and version be the intention — the source language — and that code be the derivative. A larger model does not bring that. A format does — humble, textual, like all the ones that hold up the tower — that someone has to design, test, and circulate until it becomes a path.

And here is the revealing part, the one that gives this essay its title. That format is not a computer-science problem. Intention written for humans is imprecise on purpose: a README says “handles users” and trusts the reader to fill the gaps. As an executable source language, those gaps get filled by the compiler with its choices, not yours. So the general intention format has to be a stricter relative of the README: precise where it matters, deliberately open only where you truly do not care how it gets resolved.

That is not writing code — it is writing with the precision of someone drafting a law: knowing in which sentence to be surgical and in which to loosen, anticipating how each word will be interpreted, closing the gaps you do not want someone else to fill for you. The missing half of software’s future looks more like jurisprudence than engineering. Talent shifts from logic toward clarity of desire.

## The only floor the tower cannot build by itself

It is worth drawing a boundary, because it is easy to get dizzy and believe the next layer is “that the machine wants things.” It is not.

This whole layer works with the machine as a compiler of an intention you put in. You want; it translates. It does not need — and it is better that it not have — desires of its own: you want a compiler faithful to your desire, not one that competes with it. The moment you try to write the machine’s purpose into a file, that purpose becomes yours again, neatly written. That you have to define the edge is the proof that wanting remains yours.

Devin compiles. DESIGN.md stores. The missing format would unite the two. But none of the three generates the intention — you put it in. The place of the one who decides what is worth wanting is not a hole the next layer comes to fill: it is what remains outside the tower, on the side of whoever uses it. The tower can grow upward forever, and that place remains human. Not because the machine cannot reach it — because it is not a floor of the tower. It is the hand that presses the switch at the very top.

---

Two of the most capable companies in the world each built one half of the same inversion, without naming it. The missing half — intention as the source language of the entire system — will not be brought by a larger model, because it is not a compute problem: it is a problem of exact writing. You do not need to be Google or Cognition to solve it. You need to see that the two halves are halves, and understand that the middle piece is drafted, not programmed.
