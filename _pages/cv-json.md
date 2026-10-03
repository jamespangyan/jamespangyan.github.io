---
layout: archive
title: "CV"
permalink: /cv-json/
author_profile: false
redirect_from:
  - /resume-json
  - /cv/
---

{% include base_path %}

<p>Curriculum vitae &middot; October 2026</p>
<p><a href="{{ base_path }}/files/James_Pang_CV_Oct_2026.pdf" target="_blank" rel="noopener">Open PDF in a new tab</a> &middot; <a href="{{ base_path }}/files/James_Pang_CV_Oct_2026.pdf" download="James_Pang_CV_Oct_2026.pdf">Download CV</a></p>

<div id="cv-pdf-viewer" data-pdf-url="{{ base_path }}/files/James_Pang_CV_Oct_2026.pdf">
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1em; margin-bottom: 1em;" aria-label="CV page navigation">
    <button id="cv-previous" type="button" disabled>Previous</button>
    <span id="cv-page-status" role="status" aria-live="polite">Loading CV…</span>
    <button id="cv-next" type="button" disabled>Next</button>
  </div>
  <canvas id="cv-pdf-canvas" aria-hidden="true" style="display: block; width: 100%; border: 1px solid #ddd; background: white;"></canvas>
  <div id="cv-page-text" class="sr-only"></div>
</div>
<noscript><p>Please use the PDF link above to view the CV.</p></noscript>
<script type="module" src="{{ base_path }}/assets/js/cv-pdf-viewer.mjs"></script>
