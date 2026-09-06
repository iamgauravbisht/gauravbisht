---
title: "AI Agents"
description: "Understanding the basic architecture of an AI agent."
date: "2026-09-05"
tags:
  - ai
  - agents
  - llm
published: true
---

# Building AI Agents

AI agents are systems that can reason about a task,
select tools and execute multiple steps to accomplish
a goal.

A basic architecture looks like:

User
↓
LLM
↓
Decision
↓
Tool
↓
Result
↓
LLM

The interesting part is how we design the loop between
the model, tools and state.
