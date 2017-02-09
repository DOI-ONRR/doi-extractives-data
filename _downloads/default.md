---
title: Daten & Dokumentation Herunterladen
layout: content_wide
permalink: /downloads/
---
<section class="container" style="position: relative;">
  <div class="container-left-9">
    <div id="federal_production">
      <h2>{% t 'data.production-title' %}</h2>
      <hr/>
      <p>{% t 'data.description-1' %}</p>
      <p class="downloads-download_links-intro">
        {% t 'data.description-2' %}
        <ul class="downloads-download_links">
          <li><a href="{{site.baseurl_root}}/downloads/Datenbeispiel_Kohlenwasserstoffe_d-eiti.xlsx"><icon class="icon-cloud icon-padded"></icon>Daten herunterladen (xlsx, 10 KB)</a></li>
        </ul>
      </p>
    </div>

    <div id="production_chart">
      <h2>{% t 'data.chart-title' %}</h2>
      <hr/>
      <p>{% t 'data.description-1' %}</p>
      <p class="downloads-download_links-intro">
        {% t 'data.description-2' %}
        <ul class="downloads-download_links">
          <li><a href="{{site.baseurl_root}}/downloads/Datenbeispiel_Kohlenwasserstoffe_d-eiti.xlsx"><icon class="icon-cloud icon-padded"></icon>Daten herunterladen (xlsx, 10 KB)</a></li>
        </ul>
      </p>
    </div>

    <div id="bip">
      <h2>Daten zur Beitrag zum BIP</h2>
      <hr/>
      <p>
        Die Daten werden der aktuellen Volkswirtschaftlichen Gesamtrechnung des statistischen Bundesamtes entnommen (<a href="https://www.destatis.de/DE/Publikationen/Thematisch/VolkswirtschaftlicheGesamtrechnungen/Inlandsprodukt/InlandsproduktsberechnungEndgueltigPDF_2180140.pdf?__blob=publicationFile">PDF</a> und
        <a href="https://www.destatis.de/DE/Publikationen/Thematisch/VolkswirtschaftlicheGesamtrechnungen/Inlandsprodukt/InlandsproduktsberechnungEndgueltigXLS_2180140.xlsx?__blob=publicationFile"> EXCEL</a>).Der Wirtschaftszweig „Bergbau und Gewinnung von Steinen und Erden“ umfasst die Gewinnung natürlich vorkommender fester (wie Kohle, Salz und Erze), flüssiger (Erdöl) und gasförmiger (Erdgas) mineralischer Rohstoffe.  Eine detaillierte Auflistung findet sich in der <a href="https://www.destatis.de/DE/Publikationen/Verzeichnis/KlassifikationWZ08_3100100089004.pdf;jsessionid=0CEA093B5E7B3662C7D0F71426EA900A.cae3?__blob=publicationFile">„Klassifikation der Wirtschaftszweige“ </a> des statistischen Bundesamts auf Seite 175-185.
      </p>
       <p>
         Beim Übergang von der Bruttowertschöpfung (zu Herstellungspreisen) zum Bruttoinlandsprodukt sind die Nettogütersteuern (Gütersteuern abzüglich Gütersubventionen) global hinzuzufügen, um zu einer Bewertung des Bruttoinlandsprodukts zu Marktpreisen zu gelangen.“
       </p>
       <p>
       <a href="https://www.destatis.de/DE/ZahlenFakten/GesamtwirtschaftUmwelt/VGR/Glossar/Bruttowertschoepfung.html">Quelle:</a></p>
    </div>

    <div id="beschäftigten">
      <h2>Daten zur Beschäftigten</h2>
      <hr/>
      <p>
        Die Daten zu den Beschäftigten werden der jährlich erscheinenden Publikation „Der Bergbau in der Bundesrepublik Deutschland“ des Bundesministeriums für Wirtschaft und BMWi entnommen <a href="http://www.bmwi.de/Redaktion/DE/Publikationen/Energie/Bergbaustatistiken/bergbau-in-der-brd-bergwirtschaft-statistik-2015.pdf?__blob=publicationFile&v=7"> (PDF und EXCEL)</a>. Zur Berechnung des prozentualen Anteils der Beschäftigten wurde auf die Gesamtzahl der Erwerbstätigen der Arbeitsmarktstatistik des Statistischen Jahrbuches des Statistischen Bundesamtes zurückgegriffen <a href="https://www.destatis.de/DE/Publikationen/StatistischesJahrbuch/Arbeitsmarkt.pdf?__blob=publicationFile">(PDF)</a>.
      </p>
    </div>

    <div id="exporte">
      <h2>Daten zur Exporte</h2>
      <hr/>
      <p>
        Die Daten zu den deutschen Rohstoffexporten basieren auf Angaben zu den Güterabteilungen (GP09-05 bis GP09-08) des Güterverzeichnisses für Produktionsstatistiken vom Statistischen Bundesamt. Die Daten der Exporte von 2010-2014 wurden der <a href="https://www-genesis.destatis.de/">Genesis-Online-Datenbank </a> von Destatis am 14.12.2016 entnommen. Die Daten für 2015 sind auf der <a href="https://www.destatis.de/DE/ZahlenFakten/GesamtwirtschaftUmwelt/Aussenhandel/Tabellen/EinfuhrAusfuhrGueterabteilungen.html">Website</a> des Statistischen Bundesamtes abrufbar. (EXCEL)
      </p>
    </div>
  </div>
  <div class="sticky sticky_nav container-right-3">
    <h3 class="state-page-nav-title container">
      <div class="nav-title">{{ page.title }}</div>
    </h3>
    <nav>
      {% include case-studies/_nav-list.html %}
    </nav>
  </div>
</section>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min.js"></script>
<script type="text/javascript" src="{{ site.baseurl_root }}/js/lib/static.min.js" charset="utf-8"></script>
