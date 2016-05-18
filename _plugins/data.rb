module EITI

  module Data

    # access a nested property of the (assumed) Hash data:
    #
    # get({'a' => 1000}, 'a') == 1000
    # get({'2001' => 5}, 2001) === 5
    def get(data, *keys)
      # bail if there's no data
      return nil if data == nil

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


    # attempt to look up a term in a dictionary (hash),
    # and return the value if that key exists; otherwise, return the key
    def lookup(term, dict)
      (dict.key? term) ? dict[term] : term
    end


    # create an integer range array from either a start and end number, or
    # a 2-element array
    def range(start, finish=nil)
      if start.is_a? Array
        (start, finish) = start
      end
      (start..finish).to_a
    end

  end

end

Liquid::Template.register_filter(EITI::Data)
