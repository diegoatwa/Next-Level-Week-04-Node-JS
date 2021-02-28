import { Request, Response } from "express"
import { getCustomRepository, Not, IsNull } from "typeorm"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"

// Detratores 0-6
// Passivos 7-8
// Promotores 9-10
// ((Promotores - Detratores) / (Detratores + Passivos + Promotores)) * 100 = "NPS"
class NpsController {
  async execute(req: Request, res: Response) {

    const { survey_id } = req.params
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveysUsersRepository.find({ survey_id, value: Not(IsNull()) })

    const detractor = surveysUsers.filter
      ((survey) => survey.value >= 0 && survey.value <= 6).length

    const promoters = surveysUsers.filter
      ((survey) => survey.value >= 9 && survey.value <= 10).length

    const passive = surveysUsers.filter
      ((survey) => survey.value >= 7 && survey.value <= 8).length

    const totalAnswers = surveysUsers.length

    const calculated = (((promoters - detractor) / totalAnswers) * 100).toFixed(2)

    return res.json({
      detractor: detractor,
      promoters: promoters,
      passive: passive,
      totalAnswers: totalAnswers,
      calculated: calculated + "%"
    })
  }
}

export { NpsController }
