import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from './models/customer.model';
import { UseGuards } from '@nestjs/common';
import { HttpBearerGuard } from './../common/guards/http-bearer.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { CustomerList } from './models/customer-list.model';
import { CustomerPaginationArgs } from './dto/customer-pagination.args';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
@UseGuards(HttpBearerGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => Customer, { description: 'Create a new customer' })
  async createCustomer(
    @Args('data') data: CreateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.createCustomer(data);
  }

  @Query(() => Customer, { description: 'Get customer by ID' })
  async customer(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Customer> {
    return this.customerService.customer(id);
  }

  @Query(() => CustomerList, {
    description: 'Get all customers with pagination (offset-based)',
  })
  async customers(@Args() args: CustomerPaginationArgs): Promise<CustomerList> {
    return this.customerService.customers(args.skip || 0, args.take || 10);
  }

  @Mutation(() => Customer, { description: 'Update customer' })
  async updateCustomer(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, data);
  }

  @Mutation(() => Boolean, { description: 'Delete customer' })
  async deleteCustomer(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.customerService.deleteCustomer(id);
  }
}
