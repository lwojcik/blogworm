---
eleventyExcludeFromCollections: true
pagination:
  data: collections.feedItems
  size: 10
  alias: items
permalink: "{% if pagination.pageNumber > 0 %}/{{ pagination.pageNumber + 1 }}{% endif %}/index.html"
---

<h1>Latest News</h1>

{% for item in items %}

## {{ item.title }}

Published on {{ item.published }}

{{ item.link }}

{{ item.description | safe }}

{% endfor %}
