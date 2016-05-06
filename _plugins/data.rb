module EITI

  module Data

    # access a nested property of the (assumed) Hash data:
    #
    # get({'a' => 1000}, 'a') == 1000
    # get({'2001' => 5}, 2001) === 5
    def get(data, *keys)
      # coerce all of the keys to strings,
      # and filter out any empty ones
      keys = keys
        .map{ |k| k.to_s }
        .select{ |k| not k.empty? }
      for key in keys
        for k in key.split('.')
          data = data[k]
          if not data
            return nil
          end
        end
      end
      data
    end

    # pad the provided string with the provided padding character (or a
    # space, by default) if its length is less than a given length
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
