import tabula

#tables = tabula.read_pdf("./BB-PO-1.pdf", pages='all', multiple_tables = True)
#print(len(tables))
#df = pd.DataFrame(tables)
#print(data.info())
tabula.convert_into("./BB PO 2.pdf", "max-temp-02.json", output_format="json", pages="all", lattice = True, stream = False)

