import { JsonSchema } from '../types/types'
/**
 * Returns an (yesql formatted) upsert function based on the key/vals of an object.
 * eg,
 *  insert into customers ("id", "name")
 *  values (:id, :name)
 *  on conflict (id)
 *  do update set (
 *   "id" = :id,
 *   "name" = :name
 *  )
 */
export const constructUpsertSql = (
  schema: string,
  table: string,
  tableSchema: JsonSchema,
  options?: {
    conflict?: string
  }
): string => {
  const { conflict = 'id' } = options || {}
  const properties = tableSchema.properties

  return `
    insert into "${schema}"."${table}" (
      ${Object.keys(properties)
        .map((x) => `"${x}"`)
        .join(',')}
    )
    values (
      ${Object.keys(properties)
        .map((x) => `:${x}`)
        .join(',')}
    )
    on conflict (
      ${conflict}
    )
    do update set 
      ${Object.keys(properties)
        .map((x) => `"${x}" = :${x}`)
        .join(',')}
    ;`
}
