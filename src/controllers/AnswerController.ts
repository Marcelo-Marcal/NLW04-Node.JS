import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  //Recebendo os parametros vindo da rota
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    //Buscado dentro do repositorio se existe
    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    });
    //Verificar se existe esse usuario
    if(!surveyUser) {
      throw new AppError("Survey User does not exists!");
     
    }
    //Se o usuario existe, pegar ele e alterar o value
    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController }