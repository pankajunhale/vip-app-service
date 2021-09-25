import tabula
import pandas as pd

#tables = tabula.read_pdf("./BB-PO-1.pdf", pages='all', multiple_tables = True)
#print(len(tables))
#df = pd.DataFrame(tables)
data = pd.read_csv('./output.csv')
#print(data.info())
print(len(data))
tabula.convert_into("./MAX PO 2.pdf", "max-temp-02.json", output_format="json", pages="all", lattice = True, stream = False)
for index, row in data.iterrows():
  print(index)
