'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

// Popular motorcycle brands and models
const MOTORCYCLE_DATA = {
  'BMW': {
    models: [
      { name: 'R 1250 GS', years: [2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: 'S 1000 RR', years: [2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: 'F 850 GS', years: [2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'R nineT', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
    ]
  },
  'Honda': {
    models: [
      { name: 'CBR 600RR', years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020], abs: true },
      { name: 'CB 650R', years: [2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: 'Africa Twin', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'CB 500F', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
    ]
  },
  'Yamaha': {
    models: [
      { name: 'MT-07', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: 'R6', years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020], abs: true },
      { name: 'R1', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'MT-09', years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
    ]
  },
  'Kawasaki': {
    models: [
      { name: 'Ninja 650', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: 'Z900', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'Ninja ZX-6R', years: [2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'Versys 650', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], abs: true },
    ]
  },
  'Suzuki': {
    models: [
      { name: 'GSX-R 600', years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020], abs: true },
      { name: 'SV 650', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'V-Strom 650', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'GSX-S 750', years: [2017, 2018, 2019, 2020, 2021, 2022], abs: true },
    ]
  },
  'KTM': {
    models: [
      { name: '390 Duke', years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024], abs: true },
      { name: '790 Duke', years: [2018, 2019, 2020, 2021, 2022], abs: true },
      { name: '890 Duke', years: [2020, 2021, 2022, 2023, 2024], abs: true },
      { name: '1290 Super Duke R', years: [2020, 2021, 2022, 2023], abs: true },
    ]
  },
  'Harley-Davidson': {
    models: [
      { name: 'Sportster 883', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020], abs: false },
      { name: 'Street Glide', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'Fat Bob', years: [2018, 2019, 2020, 2021, 2022, 2023], abs: true },
      { name: 'Iron 1200', years: [2018, 2019, 2020, 2021, 2022], abs: false },
    ]
  },
  'Ducati': {
    models: [
      { name: 'Monster 821', years: [2014, 2015, 2016, 2017, 2018, 2019, 2020], abs: true },
      { name: 'Panigale V2', years: [2020, 2021, 2022, 2023], abs: true },
      { name: 'Scrambler 800', years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], abs: true },
      { name: 'Multistrada 950', years: [2017, 2018, 2019, 2020, 2021], abs: true },
    ]
  }
}

interface MotorcycleSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MotorcycleSelector({ 
  value, 
  onChange, 
  placeholder = "Виберіть або введіть мотоцикл..." 
}: MotorcycleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [hasABS, setHasABS] = useState<boolean | null>(null)

  // Parse existing value
  useEffect(() => {
    if (value) {
      const match = value.match(/^(.+?)\s+(.+?)\s+(\d{4})(\s+\(ABS\))?$/)
      if (match) {
        const [, brand, model, year, abs] = match
        setSelectedBrand(brand)
        setSelectedModel(model)
        setSelectedYear(year)
        setHasABS(!!abs)
      }
    }
  }, [value])

  // Build full selection string
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedYear) {
      const absText = hasABS ? ' (ABS)' : ''
      onChange(`${selectedBrand} ${selectedModel} ${selectedYear}${absText}`)
    }
  }, [selectedBrand, selectedModel, selectedYear, hasABS, onChange])

  const filteredBrands = Object.keys(MOTORCYCLE_DATA).filter(brand =>
    brand.toLowerCase().includes(search.toLowerCase())
  )

  const getModelsForBrand = (brand: string) => {
    return MOTORCYCLE_DATA[brand as keyof typeof MOTORCYCLE_DATA]?.models || []
  }

  const getYearsForModel = (brand: string, modelName: string) => {
    const models = getModelsForBrand(brand)
    const model = models.find(m => m.name === modelName)
    return model?.years || []
  }

  const checkABS = (brand: string, modelName: string) => {
    const models = getModelsForBrand(brand)
    const model = models.find(m => m.name === modelName)
    return model?.abs || false
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
          <Command className="bg-gray-800">
            <CommandInput 
              placeholder="Пошук марки..." 
              value={search}
              onValueChange={setSearch}
              className="bg-gray-800 text-gray-100"
            />
            <CommandList>
              <CommandEmpty className="text-gray-400 p-4">
                <div className="text-center">
                  <p>Марка не знайдена</p>
                  <Button 
                    variant="link" 
                    className="text-nebachiv-blue mt-2"
                    onClick={() => {
                      onChange(search)
                      setOpen(false)
                    }}
                  >
                    Використати "{search}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup className="bg-gray-800">
                {filteredBrands.map((brand) => (
                  <CommandItem
                    key={brand}
                    onSelect={() => {
                      setSelectedBrand(brand)
                      setSelectedModel('')
                      setSelectedYear('')
                      setSearch('')
                    }}
                    className="text-gray-200 hover:bg-gray-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBrand === brand ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {brand}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedBrand && (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Модель</label>
            <select 
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value)
                setHasABS(checkABS(selectedBrand, e.target.value))
              }}
              className="w-full bg-gray-800 border-gray-700 text-gray-100 rounded-md p-2"
            >
              <option value="">Виберіть модель...</option>
              {getModelsForBrand(selectedBrand).map(model => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {selectedModel && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Рік випуску</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-gray-100 rounded-md p-2"
              >
                <option value="">Виберіть рік...</option>
                {getYearsForModel(selectedBrand, selectedModel).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedModel && hasABS !== null && (
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">ABS система</span>
              </div>
              <Badge variant={hasABS ? "default" : "secondary"} className={hasABS ? "bg-green-600" : ""}>
                {hasABS ? "Є в наявності" : "Відсутня"}
              </Badge>
            </div>
          )}
        </div>
      )}

      {!selectedBrand && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Або введіть власну назву мотоцикла
        </div>
      )}
    </div>
  )
}