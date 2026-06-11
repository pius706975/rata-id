import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Customer } from './models/customer.model';
import { CustomerList } from './models/customer-list.model';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  async customer(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async customers(skip: number = 0, take: number = 10): Promise<CustomerList> {
    const total = await this.prisma.customer.count();

    const data = await this.prisma.customer.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerInput,
  ): Promise<Customer> {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      },
    });
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    return true;
  }
}
