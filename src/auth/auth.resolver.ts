import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignInOutput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInOutput)
  signIn(@Args('input') input: SignInInput) {
    return this.authService.authenticate(input.email, input.password);
  }
}
