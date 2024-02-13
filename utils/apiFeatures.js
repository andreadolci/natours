class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1.a) filter
    const queryObj = { ...this.queryString }; //creiamo un nuovo oggetto, non un riferimento
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    //1.b) advanced filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //{ duration: { $gte: 5 }} sarebbe il filtro da scrivere manualmente, se nell'url scrivo ?duration[gte]=5, diventa {duration: {gte:5}}, quindi con questa riga aggiungiamo il dollaro davanti a gte, lt...

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //2) sort
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy); // possiamo ordinare secondo più parametri, prima si segue il primo poi il secondo, sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt'); //cosi se non ci sono riordinamenti, li riordino in automatico facendo apparire i piu nuovi in alto
    }

    return this;
  }

  limitFields() {
    //3) mostrare solo campi specifici
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //select ('name surname')
    } else {
      this.query = this.query.select('-__v'); //  per non mostrare il campo v generato da node
    }

    return this;
  }

  paginate() {
    //4) Pagination
    const page = this.queryString.page * 1 || 1; //convertiamo in numero, default pagina 1
    const limit = this.queryString.limit * 1 || 100; //convertiamo in numero, default 100 record a pagina

    const skip = (page - 1) * limit; //se vogliamo la pagina 3 con un limit pari a 10, dobbiamo skippare 20 record, (perchè la pagina 3 parte dal 21 record)

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
