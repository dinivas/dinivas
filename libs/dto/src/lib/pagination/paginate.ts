import { Repository, FindConditions, FindManyOptions } from "typeorm";
import { Pagination } from "./pagination";
import { IPaginationOptions } from "./pagination";

export async function paginate<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  mapper?: Function,
  searchOptions?: FindConditions<T> | FindManyOptions<T>
): Promise<Pagination<T>> {
  const page =
    options.page > 0 ? options.page - 1 : options.page < 0 ? 0 : options.page;
  const limit = options.limit;
  const route = options.route;
  const sort = options.sort.split(',');
  const sortKey= sort[0];
  const order = {};
  order[sortKey] = sort[1].toUpperCase();


  delete options.page;
  delete options.limit;
  delete options.route;

  const [items, total] = await repository.findAndCount({
    skip: page * limit,
    take: limit,
    order: order,
    ...searchOptions,
  });
  if(mapper) {
    items.map(item=> mapper(item))
  }

  const isNext = route && total / limit >= page + 1;
  const isPrevious = route && page > 0;
  const routes = {
    next: isNext ? `${route}?page=${page + 2}&limit=${limit}` : "",
    previous: isPrevious ? `${route}?page=${page}&limit=${limit}` : ""
  };

  return new Pagination(
    items,
    items.length,
    total,
    Math.ceil(total / limit),
    routes.next,
    routes.previous
  );
}