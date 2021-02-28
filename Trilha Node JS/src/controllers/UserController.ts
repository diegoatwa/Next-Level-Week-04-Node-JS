import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { UsersRepository } from "../repositories/UsersRepository"
import * as yup from "yup"
import { AppError } from "../errors/AppError"


class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body

    const schema = yup.object().shape({
      name: yup.string().required("The name is required!"),
      email: yup.string().email().required("You must provide a valid email address!")
    })

    //    if (!(await schema.isValid(req.body))) {
    //      return res.status(400).json({ error: "Validation Failed!" })
    //    }

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      throw new AppError(err)
    }

    const usersRepository = getCustomRepository(UsersRepository)
    const usarAlreadyExists = await usersRepository.findOne({ email })

    if (usarAlreadyExists) {
      throw new AppError("User already exists!")
    }

    const user = usersRepository.create({ name, email })
    await usersRepository.save(user)

    return res.status(201).json(user)
  }
}

export { UserController }
