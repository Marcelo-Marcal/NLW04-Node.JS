import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
  async create(request: Request, response: Response){
    const { title, description } = request.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    //Criar uma pesquisa
    const survey = surveysRepository.create({
      title,
      description
    });

    //Salva a informação
    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }
  //Listra todas nossas pesquisas
  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return response.json(all);
  }
}

export { SurveysController };