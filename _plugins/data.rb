require 'liquid'
require 'json'

module EITI

  module Data

    # access a nested property of the (assumed) Hash data:
    #
    # >> EITI::Data.get({'a' => 1000}, 'a')
    # => 1000
    # >> EITI::Data.get({'2001' => 5}, 2001)
    # => 5
    # >> EITI::Data.get({'x' => {'y' => 'z'}}, 'x.y')
    # => 'z'
    # >> EITI::Data.get({'x' => {'y' => 'z'}}, 'x.0')
    # => nil
    def get(data, *keys)
      # bail if there's no data
      return nil if data == nil

      # coerce all of the keys to strings,
      # and filter out any empty ones
      keys = keys.map(&:to_s).select { |k| !k.empty? }
      keys.each do |key|
        key.split('.').each do |k|
          data = data[k]
          if not data
            return nil
          end
        end
      end
      data
    end
    module_function :get

    # "unwrap" values in a 2-level hash:
    #
    # >> EITI::Data.map_hash({'2011' => {'volume' => 100}}, 'volume')
    # => {'2011' => 100}
    def map_hash(data, key)
      data.to_h.map { |k, v| [k, get(v, key)] }.to_h
    end
    module_function :map_hash

    # pad the provided string with the provided padding character (or a
    # space, by default) if its length is less than a given length
    #
    # >> EITI::Data.pad_left('100', 4)
    # => ' 100'
    # >> EITI::Data.pad_left('100', 4, '0')
    # => '0100'
    # >> EITI::Data.pad_left('100', 3)
    # => '100'
    def pad_left(str, len, pad = ' ')
      pad_by = len - str.size
      pad_by > 0 ? pad * pad_by + str : str
    end
    module_function :pad_left

    # attempt to look up a term in a hash, and return the value if that
    # key exists; otherwise, return the key
    #
    # >> EITI::Data.lookup('hi', {'hi' => 'hello'})
    # => 'hello'
    # >> EITI::Data.lookup('yo', {'hi' => 'hello'})
    # => 'yo'
    def lookup(term, hash)
      hash.key?(term) ? hash[term] : term
    end
    module_function :lookup

    # create an integer range array from either a start and end number,
    # or a 2-element array
    #
    # >> EITI::Data.range(1, 4)
    # => [1, 2, 3, 4]
    # >> EITI::Data.range([1, 4])
    # => [1, 2, 3, 4]
    def range(start, finish = nil)
      if start.is_a?(Array)
        (start, finish) = start
      end
      (start..finish).step(1).to_a
    end
    module_function :range

    # convert (or map) a value to floats
    #
    # >> EITI::Data.to_f('1.5')
    # => 1.5
    # >> EITI::Data.to_f(['1.5', '2.3'])
    # => [1.5, 2.3]
    def to_f(x)
      x.is_a?(Array) ? x.map(&:to_f) : x.to_f
    end
    module_function :to_f

    # convert (or map) a value to integers
    #
    # >> EITI::Data.to_i('5')
    # => 5
    # >> EITI::Data.to_i(['1', '2'])
    # => [1, 2]
    def to_i(x)
      x.is_a?(Array) ? x.map(&:to_i) : x.to_i
    end
    module_function :to_i

    # convert (or map) a value to strings
    #
    # >> EITI::Data.to_s(1)
    # => '1'
    # >> EITI::Data.to_s([2, 3])
    # => ['2', '3']
    def to_s(x)
      x.is_a?(Array) ? x.map(&:to_s) : x.to_s
    end
    module_function :to_s

    # takes a range and returns a list of numbers within that range
    # incremented by 1:
    #
    # Only accepts an Array. Otherwise returns the range
    # >> EITI::Data.create_list([0, 5])
    # => [0,1,2,3,4,5]
    # >> EITI::Data.create_list('[0,5]')
    # => '[0,5]'
    def create_list(range)
      if range.is_a?(Array)
        (range[0]..range[1]).step(1).to_a
      else
        range
      end
    end
    module_function :create_list

    # >> EITI::Data.json_parse('[1,2]')
    # => [1, 2]
    def json_parse(str)
      str.is_a?(String) ? JSON.parse(str) : nil
    end
    module_function :json_parse

    # takes a range and returns a list of numbers within that range
    # incremented by 1:
    #
    # >> EITI::Data.to_list('[0,5]')
    # =>[0,1,2,3,4,5]
    # >> EITI::Data.to_list([0,5])
    # => [0,1,2,3,4,5]
    # >> EITI::Data.to_list(5)
    # => 5
    def to_list(range)
      if range.is_a?(Array)
        create_list(range)
      elsif range.is_a?(String)
        range = JSON.parse(range)
        create_list(range)
      else
        range
      end
    end
    module_function :to_list

    # formats a URL-like string with either a data Hash or a
    # placeholder string:
    #
    # >> EITI::Data.format_url('foo/:bar/baz', {'bar' => 'x'})
    # => 'foo/x/baz'
    # >> EITI::Data.format_url('foo/%/baz', {'id' => 'x'})
    # => 'foo/x/baz'
    # >> EITI::Data.format_url('foo/%/baz', 'x')
    # => 'foo/x/baz'
    def format_url(format, data)
      placeholder = '%'
      pattern = /:\w+/
      if data.is_a?(Hash)
        if !format.match(pattern) && format.include?(placeholder)
          return format.gsub(placeholder, data['id'])
        else
          return format.gsub(pattern) { |k| data[k[1..k.size]] }
        end
      elsif data.is_a?(String)
        if !format.include?(placeholder)
          puts "format_url('#{format}', '#{data}':String): " +
            "no placeholder '#{placeholder}'"
        end
        return format.gsub(placeholder, data)
      else
        return format
      end
    end
    module_function :format_url

  end

end

Liquid::Template.register_filter(EITI::Data)
