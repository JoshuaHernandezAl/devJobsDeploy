const { Schema, model } = require("mongoose");
const slug = require("slug");
const shortid = require("shortid");

const VacanteSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "EL nombre de la vancante es obligatorio"],
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    trim: true,
    required: [true, "La ubicacion es obligatoria"],
  },
  salario: {
    type: String,
    default: 0,
  },
  contrato: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowercase: true,
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
  autor:{
    type:Schema.Types.ObjectId,
    ref:'Usuarios',
    required: true,
  }
});
VacanteSchema.pre("save", function (next) {
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;
  next();
});
//Indice para el buscador
VacanteSchema.index({titulo:'text'});

module.exports = model("Vacante", VacanteSchema);
