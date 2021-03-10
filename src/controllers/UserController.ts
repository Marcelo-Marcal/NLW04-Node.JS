import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    //Validação
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });
    
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }
    
    //Para salvar os dados no repositorio e acesso a alguns metodos typeorm
    const usersRepository = getCustomRepository(UsersRepository);

    //Traga o usuario por email
    const userAlreadyExists = await usersRepository.findOne({
      email
    });
    
    //Regra se existir um usuario com o email
    if(userAlreadyExists) {
      throw new AppError("User already exists");      
    }

    const user = usersRepository.create({
      name, 
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);

  }
}

export { UserController };
