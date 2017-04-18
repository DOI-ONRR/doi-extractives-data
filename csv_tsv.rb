require "csv"

File.open("./data/revenue/onshore_1.tsv","w") {|out|
  CSV.foreach("./data/revenue/onshore.csv") {|l|
    out.write(l.join("\t")+"\n")
  }
}
