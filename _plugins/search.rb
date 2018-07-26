module Jekyll
  class SearchStoreTag < Liquid::Tag
    def initialize(tag, text, tokens)
      super
    end

    def slugify(str)
      str.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
    end

    def create_store(collections)
      obj = {}
      collections.each do |collection|
        collection['docs'].each do |doc|
          url = doc.data['permalink'] || doc.url
          if doc.data['title'] && doc.data['description'] && doc.data['tag']
            new_obj = {
              title: doc.data['title'],
              description: doc.data['description'],
              tag: doc.data['tag'],
              url: url,
              internal: true
            }
            obj[slugify(url)] = new_obj
          else
            next
          end
        end
      end.flatten.compact
      obj.to_json
    end

    # Grabs an array of posts by tag. If that array has fewer than 3 posts,
    # grabs more posts by author. Returns a list of the first five posts in the
    # array.
    def render(context)
      site = context['site']
      collections = site['collections']
      create_store(collections).to_json
    end
  end
end
Liquid::Template.register_tag('search_store', Jekyll::SearchStoreTag)
