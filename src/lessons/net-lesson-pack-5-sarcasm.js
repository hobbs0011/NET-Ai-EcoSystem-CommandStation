"use strict";

const NETLessonPackSarcasm = {
  sarcasm_I1: {
    id: "sarcasm_I1",
    title: "NET Lesson (I-1): Sarcasm & Hidden Meaning",
    level: "I-1",
    estMinutes: 45,
    scenes: [
      {
        title: "Landing: The Rainy Walk to School",
        content: `
          <p>It&apos;s 7:15 a.m. You arrive at school completely <em>soaked</em> from a heavy storm.</p>
          <p>Your friend looks at your wet uniform and says, <strong>&quot;Wow, perfect weather today.&quot;</strong></p>
          <p>Do they really mean it? Of course not. This is our topic today: <strong>Sarcasm</strong>.</p>
          <ul class="list-disc list-inside mt-3">
            <li>Goal 1: Understand what sarcasm is and why people use it.</li>
            <li>Goal 2: Learn key vocabulary, idioms, and slang for sarcasm.</li>
            <li>Goal 3: Practice using sarcasm safely and correctly in English.</li>
          </ul>
        `
      },
      {
        title: "What is Sarcasm?",
        content: `
          <p><strong>Sarcasm</strong> is when you say the <em>opposite</em> of what you really mean, usually to be funny, dramatic, or critical.</p>
          <p>Example:</p>
          <ul class="list-disc list-inside">
            <li>Situation: You get 1/10 on a quiz.</li>
            <li>Student: <strong>&quot;Wow, I&apos;m a genius.&quot;</strong></li>
          </ul>
          <p>The words are positive, but the <strong>tone</strong> and the <strong>context</strong> show a negative meaning.</p>
        `
      },
      {
        title: "Game – Sarcastic or Sincere?",
        content: `
          <p>Read the situation and the line. Decide if it is <strong>sarcastic</strong> or <strong>sincere</strong>.</p>
          <p class="mt-2"><strong>Situation:</strong> Your friend arrives 40 minutes late to the movie.</p>
          <p><strong>Line:</strong> &quot;Wow, you&apos;re so early.&quot;</p>
          <ul>
            <li>Sarcastic → The real meaning is: &quot;You are very late.&quot;</li>
            <li>Sincere → The surface meaning is the real meaning.</li>
          </ul>
        `
      }
    ]
  }
};

// optional auto load if NET exists
if (window.NET && typeof window.NET.loadLessonPack === "function") {
  window.NET.loadLessonPack(NETLessonPackSarcasm);
}
