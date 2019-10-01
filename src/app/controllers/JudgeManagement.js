import PasswordGenerator from 'password-generator';
import Judge from '../models/Judge';
import Database from '../../database';
import Stand from '../models/Stand';

module.exports = {
  async index(req, res) {
    const judges = await Judge.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Stand,
          as: 'stands',
          through: { attributes: [] },
        },
      ],
    });
    return res.status(200).json(judges);
  },

  async create(req, res) {
    const { name, email } = req.body;
    try {
      await Database.connection.sync;
      const generatedPassword = PasswordGenerator(12, true);
      const { id } = await Judge.create({
        name,
        email,
        password: generatedPassword,
      });
      return res.status(201).json({ id, password: generatedPassword });
    } catch (error) {
      if (error.errors[0].validatorKey === 'not_unique') {
        return res.status(409).send('Árbitro já cadastrado.');
      }
      return res.status(500).send('Não foi possível cadastrar o árbitro.');
    }
  },
  async update(req, res) {
    return res.json({ ok: true });
  },
};
