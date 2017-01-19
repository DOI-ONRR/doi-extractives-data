---
title: Daten entdecken
layout: default
permalink: /explore/
---

<section class="slab-delta">
  <div class="container-outer landing-section_top">
    <div class="container-left-8 hero-left">
      <h1>{% t 'explore-data.title' %}</h1>
      <p class="hero-description">{% t 'explore-data.introduction-first' %}</p>
      <p class="hero-description">{% t 'explore-data.introduction-second' %}</p>
    </div>
    <div class="container-right-4 hero-right">
      <div class="hero-right_square">
        <figure>
          <a href="#production">
            <img class="hero-right_image" src="{{ site.baseurl_root }}/img/explore-landing-intro.png" alt="Explore landing intro">
          </a>
          <figcaption class="hero-right_caption">
            {% t 'explore-data.figcaption' %}
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

<section accordion="explore-landing" accordion-desktop="false" class="container-outer landing-wrapper">
  <section class="container">
    <a id="production" class="link-no_under"  style="margin-bottom: 20px">
      <h2 class="h3 landing-section_category" style="margin-bottom: 20px">
        {% t 'explore-data.production.heading-1' %}
      </h2>
    </a>
    <a href="{{ site.lang | url_lang_prefix  }}/explore/federal-production" class="tile">
      <span>
        {% t 'explore-data.production.sub-heading-1' %}
      </span>
    </a>
    <a href="{{ site.lang | url_lang_prefix  }}/explore/production-charts" class="tile">
      <span>
        {% t 'explore-data.production.sub-heading-2' %}
      </span>
    </a>
  </section>
  <section class="container">
    <a id="revenue" class="link-no_under">
      <h2 class="h3 landing-section_category" style="margin-bottom: 20px">
        {% t 'explore-data.revenue.heading-1' %}
      </h2>
    </a>
    <a href="#" class="tile disabled">
      <span>
        {% t 'explore-data.production.sub-heading-2' %}
      </span>
    </a>
  </section>
  <section class="container">
    <a id="economic-impact" name="economic-impact" class="link-no_under">
      <h2 class="h3 landing-section_category tile-item" style="margin-bottom: 20px">
        {% t 'explore-data.economic-impact.heading-1' %}
      </h2>
    </a>

    <a href="#" class="tile disabled">
      <span>
        {% t 'explore-data.economic-impact.sub-heading-1' %}
      </span>
    </a>
  </section>
</section>

<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/homepage.min.js" charset="utf-8"></script>
