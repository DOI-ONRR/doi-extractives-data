module EITI

  module Data

    # access a nested property of the (assumed) Hash data:
    #
    # get({"a" => 1000}, "a") == 1000
    # get({"2001" => 5}, 2001) === 5
    def get(data, *keys)
      # bail if there"s no data
      return nil if data == nil

      # coerce all of the keys to strings,
      # and filter out any empty ones
      keys = keys.map(&:to_s).select { |k| !k.empty? }
      for key in keys
        key.split(".").each do |k|
          data = data[k]
          if not data
            return nil
          end
        end
      end
      data
    end

    # "unwrap" values in a 2-level hash:
    #
    # map_hash({'2011' => {'volume' => 100}}, 'volume')
    # > {'2011' => 100}
    def map_hash(data, key)
      data.to_h.map { |k, v| [k, get(v, key)] }.to_h
    end

    # pad the provided string with the provided padding character (or a
    # space, by default) if its length is less than a given length
    def pad_left(str, len, pad = " ")
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
    def range(start, finish = nil)
      if start.is_a? Array
        (start, finish) = start
      end
      (start..finish).to_a
    end

    # convert (or map) a value to floats
    def to_f(x)
      (x.is_a? Array) ? x.map(&:to_f) : x.to_f
    end

    # convert (or map) a value to integers
    def to_i(x)
      (x.is_a? Array) ? x.map(&:to_i) : x.to_i
    end

    # convert (or map) a value to strings
    def to_s(x)
      (x.is_a? Array) ? x.map(&:to_s) : x.to_s
    end

    # attempts to find a substring
    # returns the value true if the key exists; otherwise, return nil
    def is_in(term, str)
      if str
        (str.include? term) ? true : nil
      end
    end
    # takes a range and returns a list of numbers within that range
    # incrimented by 1
    # Only accepts an Array. Otherwise returns the range
    # e.g [0,5] => [0,1,2,3,4,5]
    # e.g '[0,5]' => '[0,5]'
    def create_list(range)
      if range.is_a? Array
        arr = []
        min = range[0]
        max = range[1]
        (min..max).step(1) do |i|
          arr.push(i)
        end
        arr
      else
        range
      end
    end

    # takes a range and returns a list of numbers within that range
    # incrimented by 1
    # e.g '[0,5]' => [0,1,2,3,4,5]
    # e.g [0,5] => [0,1,2,3,4,5]
    # If the input is not a string, it returns the input value
    # e.g 5 => 5
    def to_list(range)
      if range.is_a? Array
        create_list(range)
      elsif range.is_a? String
        range = JSON.parse(range)
        create_list(range)
      else
        range
      end
    end

    # formats a URL-like string with either a data Hash or a
    # placeholder string:
    #
    # format_url("foo/:bar/baz", {"bar" => "x"}) == "foo/x/baz"
    # format_url("foo/%/baz", {"id" => "x"}) == "foo/x/baz"
    # format_url("foo/%/baz", "x") == "foo/x/baz"
    def format_url(format, data)
      placeholder = "%"
      pattern = /:\w+/
      if data.is_a? Hash
        if !format.match(pattern) and format.include? placeholder
          return format.gsub(placeholder, data["id"])
        else
          return format.gsub(pattern) { |k| data[k[1..k.size]] }
        end
      elsif data.is_a? String
        if !format.include? placeholder
          puts "EITI::Data::format_url('#{format}', '#{data}':String): no such placeholder '#{placeholder}'"
        end
        return format.gsub(placeholder, data)
      else
        return format
      end
    end

    def zip(keys, values)
      keys.zip(values)
    end

    def compact(value)
      binding.pry
    end

  end
end

Liquid::Template.register_filter(EITI::Data)
