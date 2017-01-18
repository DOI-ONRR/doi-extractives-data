module LocalisationHelper
  def url_lang_prefix(value)
    value != 'de' ? '/'+value : ''
  end
end

Liquid::Template.register_filter(LocalisationHelper)
