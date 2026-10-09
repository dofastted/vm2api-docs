<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  body: string
  file: string
  code: string
  ctaTitle: string
  ctaText: string
  ctaLink: string
}>()
</script>

<template>
  <section class="showcase">
    <div class="split">
      <div class="copy">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p class="body">{{ body }}</p>
      </div>
      <div class="window" aria-hidden="true">
        <div class="bar">
          <span class="dot" /><span class="dot" /><span class="dot" />
          <span class="file">{{ file }}</span>
        </div>
        <pre><code>{{ code }}</code></pre>
      </div>
    </div>

    <div class="cta">
      <h2>{{ ctaTitle }}</h2>
      <a class="cta-btn" :href="ctaLink">{{ ctaText }}</a>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  max-width: 1152px;
  margin: 0 auto;
  padding: 64px 24px 96px;
}
@media (min-width: 640px) {
  .showcase { padding: 80px 48px 112px; }
}
@media (min-width: 960px) {
  .showcase { padding: 96px 64px 128px; }
}

.split {
  display: grid;
  gap: 40px;
  align-items: center;
}
@media (min-width: 960px) {
  .split { grid-template-columns: 5fr 6fr; gap: 64px; }
}

.showcase .eyebrow {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--t-accent);
}
.showcase h2 {
  margin: 0;
  border: none;
  padding: 0;
  font-family: var(--t-font-display);
  font-weight: var(--t-display-weight);
  letter-spacing: var(--t-display-tracking);
  font-size: 36px;
  line-height: 1.12;
  color: var(--t-text);
}
@media (min-width: 640px) {
  .showcase h2 { font-size: 44px; }
}
.showcase .body {
  margin: 20px 0 0;
  font-size: 18px;
  line-height: 1.65;
  color: var(--t-text-2);
}

.window {
  border: 1px solid var(--t-border);
  border-radius: var(--t-radius);
  background: var(--t-surface);
  box-shadow: var(--t-shadow-hover);
  overflow: hidden;
}
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--t-border);
  background: var(--t-bg-alt);
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--t-border);
}
.file {
  margin-left: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--t-text-3);
}
.showcase pre {
  margin: 0;
  padding: 22px 24px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--t-text);
}

.cta {
  margin-top: 96px;
  padding: 64px 24px;
  border-radius: calc(var(--t-radius) + 8px);
  background: var(--t-bg-alt);
  text-align: center;
}
.showcase .cta-btn {
  display: inline-block;
  margin-top: 28px;
  padding: 12px 26px;
  border-radius: var(--t-radius-btn);
  background: var(--t-btn-bg);
  color: var(--t-btn-text);
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.2s, transform 0.2s;
}
.showcase .cta-btn:hover {
  background: var(--t-btn-hover-bg);
}
.showcase .cta-btn:active {
  transform: scale(0.98);
}
</style>
