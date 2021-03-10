import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

//Calculo de NPS
class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    //Trazer um arry com todas as resposta que tem
    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });
    //Filtrado os detratores 
    const detractor = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6    
    ).length;
    //Filtrado os promotores
    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;
    //Filtrado os passivos
    const passive = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;
    //O total de respondentes
    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };



/**
 * Explicação:
 1 2 3 4 5 6 7 8 9 10
 Detratores => 0 - 6
 Passivos => 7 - 8
 Promotores => 9 - 10

 Calculo
 (Numero de Promotores - numero de Detratores) / (numero de respondentes) x 100

 */