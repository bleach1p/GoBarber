import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentControoler {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Not a valid Schema for this req' });
    }

    const { provider_id, date } = req.body;

    if (
      !(await User.findOne({
        where: {
          id: provider_id,
          provider: true,
        },
      }))
    ) {
      return res
        .status(401)
        .json({ error: `User ${provider_id} is not a provider!` });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json(appointment);
  }
}

export default new AppointmentControoler();
