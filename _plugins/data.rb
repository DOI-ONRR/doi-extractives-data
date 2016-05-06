module EITI

  module Data

    def get(data, *keys)
      for key in keys.select{ |k| not k.empty? }
        for k in key.split('.')
          data = data[k]
          if not data
            return nil
          end
        end
      end
      data
    end

    def pad_left(str, len, pad=' ')
      pad_by = len - str.size
      if pad_by > 0
        return pad * pad_by + str
      end
      str
    end

  end

end

Liquid::Template.register_filter(EITI::Data)
