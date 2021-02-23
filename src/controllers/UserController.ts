import { Request, Response } from "express"
import { User } from "../models/User"
import { getRepository } from "typeorm"

class UserController {
    async create(req: Request, res: Response){
        const { name, email } = req.body
        const usersRepository = getRepository(User)
        const usarAlreadyExists = await usersRepository.findOne({ email })

        if (usarAlreadyExists){
            return res.status(400).json({
                error: "User already exists!"
            })
        }

        const user = usersRepository.create({ name, email })
        await usersRepository.save(user)
        
        return res.json(user)
    }
}

export { UserController }